import Loan from "../models/loan.model.js";
import Member from "../models/member.model.js";

// Create a new loan application
export const createLoanApplication = async (req, res) => {
  try {
    const memberId = req.user.id;

    const newLoan = new Loan({
      ...req.body,
      memberId,
    });

    const savedLoan = await newLoan.save();

    await Member.findByIdAndUpdate(
      memberId,
      { $push: { loans: savedLoan._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Loan created and added to member successfully",
      loan: savedLoan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create loan",
      error: error.message,
    });
  }
};

//this is
// View all loan applications
export const viewAllLoanApplications = async (req, res) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// this is second change
// View a single loan application by ID
export const viewSingleLoanApplication = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan application not found..!" });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a loan application by ID
export const updateLoanApplication = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!loan) {
      return res.status(404).json({ error: "Loan application not found !" });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a loan application by ID
export const deleteLoanApplication = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan application not found" });
    }
    res.status(200).json({ message: "Loan application deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
