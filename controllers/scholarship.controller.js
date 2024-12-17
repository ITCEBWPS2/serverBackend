import Scholarship from "../models/scholarship.model.js";
import Member from "../models/member.model.js";

// @desc Create a Scholarship
// @route POST /api/scholarship
// @access Private (Admin/Member)
export const createScholarship = async (req, res) => {
  try {
    const { memberId, epfNumber, indexNumber, amount } = req.body;

    const newBenefit = new Scholarship({
      benefit: "scholarship",
      memberId,
      epfNumber,
      indexNumber,
      amount,
    });

    const savedBenefit = await newBenefit.save();

    await Member.findByIdAndUpdate(
      memberId,
      { $push: { benefits: savedBenefit._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Scholarship created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create Scholarship.",
      error: error.message,
    });
  }
};
