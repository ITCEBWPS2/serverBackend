import Loan from "../models/loan.model.js";
import Member from "../models/member.model.js";

// @desc Create a Loan Application
// @route POST /api/loans
// @access Private (Admin/Member)
export const createLoanApplication = async (req, res) => {
  const {
    epf,
    loanNumber,
    loanAmount,
    name,
    address,
    position,
    branch,
    contactNo,
    nationalIdNumber,
    reasonForLoan,
    requiredLoanDate,
    dateOfBirth,
    retirementDate,
    loanStatus,
  } = req.body;

  try {
    const newLoan = new Loan({
      epf,
      loanNumber,
      loanAmount,
      name,
      address,
      position,
      branch,
      contactNo,
      nationalIdNumber,
      reasonForLoan,
      requiredLoanDate,
      dateOfBirth,
      retirementDate,
      loanStatus,
    });

    const savedLoan = await newLoan.save();

    const updatedMember = await Member.findOneAndUpdate(
      { epf },
      { $push: { loans: savedLoan._id } },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({
        message: "Member not found with the provided EPF number",
      });
    }

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

// @desc Get Loans by User ID
// @route GET /api/loans/user/:userId
// @access Private (Admin/Member)
export const getLoansByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const member = await Member.findById(userId).populate("loans");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({
      message: "Loans retrieved successfully",
      loans: member.loans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve loans",
      error: error.message,
    });
  }
};

// @desc View All Loan Applications
// @route GET /api/loans
// @access Private (Admin)
export const viewAllLoanApplications = async (req, res) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Get All Loan Applications by Status
// @route GET /api/loans/util/loans-by-status
// @access Private (Admin)
export const getAllLoansByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status && status !== "all") {
      filter.loanStatus = status;
    }

    const loans = await Loan.find(filter);
    res.status(200).json(loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching loans", error: error.message });
  }
};

// @desc View Single Loan Application
// @route GET /api/loans/:id
// @access Private (Admin/Member)
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

// @desc Update Loan Status
// @route PUT /api/loans/:id/status
// @access Private (Admin)
export const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { loanStatus } = req.body;

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(loanStatus)) {
      return res.status(400).json({ message: "Invalid loan status" });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId,
      { loanStatus },
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({
      message: "Loan status updated successfully",
      loan: updatedLoan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update loan status",
      error: error.message,
    });
  }
};

// @desc Update Loan Application
// @route PUT /api/loans/:id
// @access Private (Admin)
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

// @desc Delete Loan Application
// @route DELETE /api/loans/:id
// @access Private (Admin)
export const deleteLoanApplication = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan application not found" });
    }

    await Member.findOneAndUpdate(
      { epf: loan.epf },
      { $pull: { loans: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      message: "Loan deleted successfully and removed from user loans",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Generate Loan Number
// @route GET /api/loans/util/generate-loan-number
// @access Private (Admin)
export const generateLoanNumber = async (req, res) => {
  try {
    let isUnique = false;
    let uniqueNumber;

    while (!isUnique) {
      uniqueNumber = Math.floor(100000 + Math.random() * 900000).toString();
      const existingLoan = await Loan.findOne({ loanNumber: uniqueNumber });
      if (!existingLoan) {
        isUnique = true;
      }
    }

    res.status(200).json(uniqueNumber);
  } catch (error) {
    console.error("Error generating unique loan number:", error);
    res.status(500).send({ message: error.message });
  }
};
