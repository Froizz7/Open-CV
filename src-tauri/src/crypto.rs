use aes_gcm::aead::{Aead, KeyInit};
use aes_gcm::{Aes256Gcm, Nonce};
use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

pub struct CryptoEngine {
    key: [u8; 32],
}

impl CryptoEngine {
    pub fn new() -> Self {
        let machine_seed = Self::derive_machine_seed();
        let mut hasher = Sha256::new();
        hasher.update(b"OpenCV-VaultKeySalt-v2.0-Production-2026");
        hasher.update(machine_seed.as_bytes());
        let digest = hasher.finalize();
        let mut key = [0u8; 32];
        key.copy_from_slice(&digest[..32]);
        Self { key }
    }

    fn derive_machine_seed() -> String {
        let mut seed = String::new();
        if let Some(user_dir) = dirs::document_dir().or_else(dirs::data_dir) {
            seed.push_str(&user_dir.to_string_lossy());
        }
        if let Ok(user) = std::env::var("USERNAME").or_else(|_| std::env::var("USER")) {
            seed.push_str(&user);
        }
        if let Ok(comp) = std::env::var("COMPUTERNAME").or_else(|_| std::env::var("HOSTNAME")) {
            seed.push_str(&comp);
        }
        if seed.trim().is_empty() {
            seed.push_str("FallbackOpenCvDeviceMasterSeed2026");
        }
        seed
    }

    pub fn encrypt(&self, plaintext: &str) -> Result<String, String> {
        let cipher = Aes256Gcm::new_from_slice(&self.key)
            .map_err(|e| format!("Cipher init error: {}", e))?;
        let mut nonce_bytes = [0u8; 12];
        rand::rngs::OsRng.fill_bytes(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);

        let ciphertext = cipher
            .encrypt(nonce, plaintext.as_bytes())
            .map_err(|e| format!("Encryption error: {}", e))?;

        let encoded_nonce = BASE64.encode(nonce_bytes);
        let encoded_ciphertext = BASE64.encode(ciphertext);
        Ok(format!("v1:{}:{}", encoded_nonce, encoded_ciphertext))
    }

    pub fn decrypt(&self, payload: &str) -> Result<String, String> {
        let parts: Vec<&str> = payload.split(':').collect();
        if parts.len() != 3 || parts[0] != "v1" {
            return Err("Invalid encrypted format".to_string());
        }

        let nonce_bytes = BASE64
            .decode(parts[1])
            .map_err(|e| format!("Base64 nonce error: {}", e))?;
        let ciphertext = BASE64
            .decode(parts[2])
            .map_err(|e| format!("Base64 ciphertext error: {}", e))?;

        if nonce_bytes.len() != 12 {
            return Err("Invalid nonce size".to_string());
        }

        let cipher = Aes256Gcm::new_from_slice(&self.key)
            .map_err(|e| format!("Cipher init error: {}", e))?;
        let nonce = Nonce::from_slice(&nonce_bytes);

        let decrypted_bytes = cipher
            .decrypt(nonce, ciphertext.as_ref())
            .map_err(|e| format!("Decryption error: {}", e))?;

        String::from_utf8(decrypted_bytes).map_err(|e| format!("UTF-8 decoding error: {}", e))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SecretsStore {
    pub keys: HashMap<String, String>,
}

pub struct SecretVault;

impl SecretVault {
    fn vault_path() -> PathBuf {
        crate::config::ConfigManager::get_app_dir().join("secrets.enc")
    }

    fn read_store() -> SecretsStore {
        let path = Self::vault_path();
        if !path.exists() {
            return SecretsStore::default();
        }
        let raw = match fs::read_to_string(&path) {
            Ok(content) => content,
            Err(_) => return SecretsStore::default(),
        };
        let crypto = CryptoEngine::new();
        let decrypted = match crypto.decrypt(raw.trim()) {
            Ok(content) => content,
            Err(_) => return SecretsStore::default(),
        };
        serde_json::from_str::<SecretsStore>(&decrypted).unwrap_or_default()
    }

    fn write_store(store: &SecretsStore) -> Result<(), String> {
        let path = Self::vault_path();
        let serialized = serde_json::to_string(store)
            .map_err(|e| format!("Vault serialization error: {}", e))?;
        let crypto = CryptoEngine::new();
        let encrypted = crypto.encrypt(&serialized)?;
        fs::write(path, encrypted).map_err(|e| format!("Failed to write vault: {}", e))?;
        Ok(())
    }

    pub fn get_key(provider_id: &str) -> Option<String> {
        let store = Self::read_store();
        store.keys.get(provider_id).cloned().filter(|k| !k.trim().is_empty())
    }

    pub fn set_key(provider_id: &str, key: &str) -> Result<(), String> {
        let mut store = Self::read_store();
        let trimmed = key.trim();
        if trimmed.is_empty() {
            store.keys.remove(provider_id);
        } else {
            store.keys.insert(provider_id.to_string(), trimmed.to_string());
        }
        Self::write_store(&store)
    }

    pub fn remove_key(provider_id: &str) -> Result<(), String> {
        let mut store = Self::read_store();
        store.keys.remove(provider_id);
        Self::write_store(&store)
    }

    pub fn has_key(provider_id: &str) -> bool {
        Self::get_key(provider_id).is_some()
    }

    pub fn clear_all() -> Result<(), String> {
        let path = Self::vault_path();
        if path.exists() {
            let _ = fs::remove_file(path);
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_crypto_engine_roundtrip() {
        let engine = CryptoEngine::new();
        let secret = "sk-test-super-secret-key-1234567890";
        let encrypted = engine.encrypt(secret).expect("Encryption failed");
        assert!(encrypted.starts_with("v1:"));
        let decrypted = engine.decrypt(&encrypted).expect("Decryption failed");
        assert_eq!(secret, decrypted);
    }

    #[test]
    fn test_encryption_nonces_are_unique() {
        let engine = CryptoEngine::new();
        let secret = "my_same_secret_string";
        let enc1 = engine.encrypt(secret).unwrap();
        let enc2 = engine.encrypt(secret).unwrap();
        assert_ne!(enc1, enc2);
    }
}
