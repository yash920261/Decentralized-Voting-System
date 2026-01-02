// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {

    address public admin;
    bool public votingActive;

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory candidateNames) {
        admin = msg.sender;
        votingActive = true;

        for(uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    function vote(uint candidateIndex) external {
        require(votingActive, "Voting is closed");
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
    }

    function closeVoting() external onlyAdmin {
        votingActive = false;
    }

    function getCandidates() external view returns(Candidate[] memory) {
        return candidates;
    }
}