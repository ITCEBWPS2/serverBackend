import express from 'express';
import {
    createLoanApplication,
    viewAllLoanApplications,
    viewSingleLoanApplication,
    updateLoanApplication,
    deleteLoanApplication
} from '../controllers/loanController.js';

const router = express.Router();

// Route to create a new loan application
router.post('/', createLoanApplication);

// Route to view all loan applications
router.get('/', viewAllLoanApplications);

// Route to view a single loan application by ID
router.get('/:id', viewSingleLoanApplication);

// Route to update a loan application by ID
router.put('/:id', updateLoanApplication);

// Route to delete a loan application by ID
router.delete('/:id', deleteLoanApplication);

export default router;



// import express from 'express';
// import { createLoanApplication } from '../controllers/loanController.js';

// const router = express.Router();

// router.post('/loan-applications', createLoanApplication);

// export default router;
