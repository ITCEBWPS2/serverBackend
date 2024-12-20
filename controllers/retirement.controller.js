import Retirement from "../models/retirement.model.js";
import Member from "../models/member.model.js";

// @desc Create a Retirement
// @route POST /api/retirements
// @access Private (Admin/Member)
export const createRetirement = async (req, res) => {
  try {
    const { memberId, date, amount } = req.body;

    const newBenefit = new Retirement({
      benefit: "retirement",
      memberId,
      date,
      amount,
    });

    const savedBenefit = await newBenefit.save();

    await Member.findByIdAndUpdate(
      memberId,
      { $push: { retirements: savedBenefit._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Retirements Gift created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create Retirement Gift.",
      error: error.message,
    });
  }
};

// @desc View All Retirements
// @route GET /api/retirements
// @access Private (Admin)
export const viewAllRetirements = async (req, res) => {
  try {
    const benefits = await Retirement.find();
    res.status(200).json(benefits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc View Single Retirement
// @route GET /api/retirements/:id
// @access Private (Admin/Member)
export const viewSingleRetirement = async (req, res) => {
  try {
    const benefit = await Retirement.findById(req.params.id);
    if (!benefit) {
      return res.status(404).json({ error: "Retirement not found..!" });
    }
    res.status(200).json(benefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Update Retirement
// @route PUT /api/retirements/:id
// @access Private (Admin)
export const updateRetirement = async (req, res) => {
  try {
    const updatedBenefit = await Retirement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBenefit) {
      return res.status(404).json({ error: "Retirement not found !" });
    }
    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete Retirement
// @route DELETE /api/retirements/:id
// @access Private (Admin)
export const deleteRetirement = async (req, res) => {
  try {
    const benefit = await Retirement.findByIdAndDelete(req.params.id);
    if (!benefit) {
      return res.status(404).json({ error: "Retirement not found" });
    }

    await Member.findByIdAndUpdate(
      benefit.memberId,
      { $pull: { retirements: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      message:
        "Retirement Gift deleted successfully and removed from member benefits",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Get Retirements by User ID
// @route GET /api/retirements/benefits/:userId
// @access Private (Admin/Member)
export const getBenefitsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const member = await Member.findById(userId).populate("retirements");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({
      message: "Benefits retrieved successfully",
      benefits: member.retirements,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve benefits.",
      error: error.message,
    });
  }
};
