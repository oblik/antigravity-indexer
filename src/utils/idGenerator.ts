export function generateUserId (address: string): string {
    return address;
}

export function generateAntigravityId(address: string, tokenId: bigint): string {
    return address.concat(tokenId.toString());
}

export function generateMineId(address: string, nonce: bigint): string {
    return address.concat(nonce.toString());
}

export function generateClaimId(address: string, nonce: bigint): string {
    return address.concat(nonce.toString());
}

export function generateWishWellId(address: string, tokenId: bigint): string {
    return address.concat(tokenId.toString());
}

export function generateHeistId(mastermind: string, victim: string, transactionHash: string): string {
    return mastermind.concat(victim).concat(transactionHash);
}

export function generateDarkTransferEntityId(to: string, from: string, transactionHash: string): string {
    return to.concat(from).concat(transactionHash);
}

export function generateFuelCellId(contractAddress: string, tokenId: bigint): string {
    return contractAddress.concat(tokenId.toString());
}

export function generateFuelCellContractId(contractAddress: string): string {
    return contractAddress;
}

export function generateTransferId(transactionHash: string, logId: string, tokenId: bigint): string {
    return transactionHash.concat(logId).concat(tokenId.toString());
}

export function generateApprovalId(transactionHash: string, tokenId: bigint): string {
    return transactionHash.concat(tokenId.toString());
}

export function generateApprovalForAllId(transactionHash: string, tokenId: bigint): string {
    return transactionHash.concat(tokenId.toString());
}

export function generateMintId(transactionHash: string, user: string): string {
    return transactionHash.concat(user);
}

export function generateJPMId(address: string): string {
    return address;
}


export function generateEvilId(address: string): string {
    return address;
}

export function generateEvilMintId(address: string, journeyId: bigint, trxHash: string, logIndex: bigint): string {
    return address.concat(journeyId.toString()).concat(trxHash).concat(logIndex.toString());
}

export function generateTreasuryId(address: string): string {
    return address
}
export function generateYieldId(address: string, journeyId: bigint, givenInJourneyId: bigint): string {
    return address.concat(journeyId.toString()).concat(givenInJourneyId.toString());
}