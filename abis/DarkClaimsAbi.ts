export const DarkClaimsAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_merkleRoot",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_totalPoints",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_mystery",
        type: "address",
        internalType: "address",
      },
      {
        name: "_evilAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "_trustedEntity",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claim",
    inputs: [
      {
        name: "addresses",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "nonces",
        type: "uint32[]",
        internalType: "uint32[]",
      },
      {
        name: "merkleProofs",
        type: "bytes32[][]",
        internalType: "bytes32[][]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimDuration",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimStartTimestamp",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimsLedger",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "dark",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract Dark",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "endClaim",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "evilAddress",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isClaimActive",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "merkleRoot",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mysteryBox",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "startClaim",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalPoints",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateClaimParams",
    inputs: [
      {
        name: "_merkleRoot",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_totalPoints",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Claimed",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "nonce",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AlreadyClaimed",
    inputs: [],
  },
  {
    type: "error",
    name: "ClaimInactive",
    inputs: [],
  },
  {
    type: "error",
    name: "ClaimNotStarted",
    inputs: [],
  },
  {
    type: "error",
    name: "EmptyDarkTokenAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "EmptyEvilAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "EmptyMerkleRoot",
    inputs: [],
  },
  {
    type: "error",
    name: "EmptyMysteryBoxAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "ExceedsAllowedArraySize",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLengths",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidProof",
    inputs: [],
  },
  {
    type: "error",
    name: "OngoingClaimPeriod",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroTotalPoints",
    inputs: [],
  },
] as const;
