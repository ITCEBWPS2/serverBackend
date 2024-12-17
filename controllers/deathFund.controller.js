import DeathFund from "../models/deathFund.model.js";
import Member from "../models/member.model.js";

// @desc Create a Death Fund
// @route POST /api/deathfunds
// @access Private (Admin/Member)
export const createDeathFund = async (req, res) => {
  try {
    const { memberId, epfNumber, personType, amount, date, additionalNotes } =
      req.body;

    const newFund = new DeathFund({
      benefit: "deathfund",
      memberId,
      epfNumber,
      personType,
      amount,
      date,
      additionalNotes,
    });

    const savedFund = await newFund.save();

    await Member.findByIdAndUpdate(
      memberId,
      { $push: { benefits: savedFund._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Fund created and added to member successfully",
      fund: savedFund,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create fund",
      error: error.message,
    });
  }
};
