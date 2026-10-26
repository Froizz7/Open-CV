import { Resume } from "../types/resume";

export const initialResume: Resume = {
  basics: {
    name: "John Doe",
    label: "Lead AI Engineer & Quantum Neural Architect",
    email: "john.doe.ai@example.com",
    phone: "+1 (310) 555-0199",
    url: "https://linkedin.com/in/johndoe-ai",
    image: "",
    summary: "Lead Neural Architect with 8+ years pioneering bio-synthetic latent manifold optimizers, non-Euclidean tensor routing, and speculative quantum attention mechanisms at Random Ai Company. Specialized in zero-entropy memory lattices, sub-atomic gradient quantization, and ultra-high-throughput neural tokenizers operating at sub-millisecond latencies.",
    location: {
      city: "Los Angeles",
      countryCode: "United States",
      region: "CA",
    },
  },
  work: [
    {
      name: "Random Ai Company",
      position: "Lead Quantum Neural Architect",
      url: "",
      startDate: "2022-03",
      endDate: "Présent",
      summary: "Directing the deep-stack synthetic intelligence and non-Euclidean latent manifold platform.",
      highlights: [
        "Architected the Hyper-Latent Manifold Transformer (HLMT-9X) orchestrating 14.2B multi-spectral synthetic tokens with 99.99% neural coherence.",
        "Invented a speculative subspace tensor annealing algorithm in CUDA/C++, compressing non-Euclidean embedding spaces by 68% and dropping median inference latency from 140ms to 42ms.",
        "Engineered the Chrono-Adaptive State Space Engine (CASSE) handling 120M+ neural synthetic queries per day with zero-entropy cache degradation."
      ],
    },
    {
      name: "Random Ai Company",
      position: "Senior Bio-Synthetic Inference Engineer",
      url: "",
      startDate: "2019-06",
      endDate: "2022-02",
      summary: "Neuromorphic tensor lattices and cross-modal embedding topologies.",
      highlights: [
        "Pioneered neuromorphic tensor lattices leveraging custom bio-digital weight quantization kernels for high-dimensional semantic clustering across 256 H100 clusters.",
        "Constructed automated anti-hallucination entanglement evaluators benchmarking 85,000+ non-linear adversarial vector permutations in real time.",
        "Integrated multi-dimensional memory fabrics using Qdrant vector spaces, boosting zero-shot latent recall from 64% to 98.2%."
      ],
    },
    {
      name: "Random Ai Company",
      position: "Neural Research Specialist",
      url: "",
      startDate: "2017-08",
      endDate: "2019-05",
      summary: "Recursive hyper-graph autoencoders and distributed tensor synchronization.",
      highlights: [
        "Developed recursive hyper-graph autoencoders for multi-agent knowledge synthesis across distributed neural sub-manifolds.",
        "Collaborated on low-precision synaptic interconnect protocols, reducing token serialization overhead by 53% in distributed Kubernetes clusters."
      ],
    },
  ],
  education: [
    {
      institution: "University of California, Los Angeles (UCLA)",
      area: "Quantum Neural Computing & Applied Cybernetics",
      studyType: "Master of Science",
      startDate: "2015",
      endDate: "2017",
    },
    {
      institution: "University of Southern California (USC)",
      area: "Computational Mathematics & Tensor Systems",
      studyType: "Bachelor of Science",
      startDate: "2011",
      endDate: "2015",
    },
  ],
  skills: [
    {
      name: "Quantum & Latent Architectures",
      keywords: ["Hyper-Latent Manifolds", "CASSE Engine", "Non-Euclidean Embeddings", "Subspace Tensor Annealing", "Bio-Synthetic Lattices", "Zero-Entropy Memory"],
    },
    {
      name: "High-Performance Neural Systems",
      keywords: ["CUDA/C++23 Kernels", "TensorRT-LLM", "Triton Compiler", "vLLM", "Distributed Tensor Sharding", "PyTorch"],
    },
    {
      name: "Autonomous Agent Routing",
      keywords: ["Multi-Spectral Tokenizers", "Recursive Hyper-Graph Routing", "Cross-Modal Entanglement", "Vector Memory Fabrics", "Qdrant"],
    },
    {
      name: "Infrastructure & Systems",
      keywords: ["Rust", "Python", "C++", "Kubernetes", "Docker", "Linux eBPF", "Git"],
    },
  ],
  projects: [],
  sectionOrder: ["work", "education", "skills"],
};
