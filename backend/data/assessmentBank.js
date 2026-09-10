// Ported directly from src/services/seedData.js's assessmentBank so the
// adaptive quiz behaves identically whether the frontend is pointed at
// the mock API or this backend.

const assessmentBank = {
  technical: [
    { id: 't1', text: 'What does REST stand for in API design?', difficulty: 'easy', options: ['Representational State Transfer', 'Remote Execution State Transfer', 'Rapid State Transfer', 'Representational Storage Transfer'], answer: 0 },
    { id: 't2', text: 'Which HTTP method is idempotent?', difficulty: 'easy', options: ['POST', 'PUT', 'PATCH (partial)', 'CONNECT'], answer: 1 },
    { id: 't3', text: 'In React, what hook is used to manage local component state?', difficulty: 'easy', options: ['useEffect', 'useState', 'useMemo', 'useRef'], answer: 1 },
    { id: 't4', text: 'What is the time complexity of binary search on a sorted array?', difficulty: 'medium', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], answer: 2 },
    { id: 't5', text: 'Which MongoDB operator is used to update a field?', difficulty: 'medium', options: ['$push', '$set', '$match', '$group'], answer: 1 },
    { id: 't6', text: 'What does JWT stand for?', difficulty: 'medium', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Transfer', 'Joint Web Token'], answer: 1 },
    { id: 't7', text: 'In a microservices architecture, what pattern helps prevent cascading failures?', difficulty: 'hard', options: ['Singleton pattern', 'Circuit breaker pattern', 'Observer pattern', 'Factory pattern'], answer: 1 },
    { id: 't8', text: 'Which consistency model does MongoDB provide by default for single-document operations?', difficulty: 'hard', options: ['Eventual consistency', 'Strong consistency', 'Causal consistency only', 'No consistency guarantee'], answer: 1 },
    { id: 't9', text: 'What is the purpose of database indexing?', difficulty: 'medium', options: ['To encrypt data', 'To speed up query performance', 'To reduce storage size', 'To back up data'], answer: 1 },
    { id: 't10', text: 'Which design principle does dependency injection primarily support?', difficulty: 'hard', options: ['Tight coupling', 'Inversion of control', 'Global state', 'Static binding'], answer: 1 }
  ],
  aptitude: [
    { id: 'a1', text: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?', difficulty: 'easy', options: ['60 km/h', '80 km/h', '75 km/h', '90 km/h'], answer: 1 },
    { id: 'a2', text: 'Find the next number: 2, 6, 12, 20, 30, ?', difficulty: 'medium', options: ['40', '42', '36', '44'], answer: 1 },
    { id: 'a3', text: "A is twice as old as B. Five years ago, A was three times as old as B. What is B's current age?", difficulty: 'hard', options: ['10', '15', '20', '25'], answer: 0 }
  ],
  soft: [
    { id: 's1', text: 'A teammate disagrees with your approach in a project meeting. What is the best response?', difficulty: 'easy', options: ['Insist you are right and move on', 'Listen to their reasoning and discuss trade-offs', 'Avoid the conflict entirely', 'Escalate immediately to a manager'], answer: 1 },
    { id: 's2', text: 'You are close to a deadline but discover a bug that needs more time to fix properly. What should you do?', difficulty: 'medium', options: ['Ship it and stay silent', 'Communicate the risk early and propose options', 'Ignore the bug', 'Blame a teammate'], answer: 1 }
  ]
}

module.exports = { assessmentBank }
