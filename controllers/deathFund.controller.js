import DeathFund from "../models/deathFund.model.js";
import Member from "../models/member.model.js";

// @desc Create a Death Fund
// @route POST /api/deathfunds
// @access Private (Admin/Member)
export const createDeathFund = async (req, res) => {
  try {
    const { memberId, epfNumber, personType, amount, date, additionalNotes } =
      req.body;

    const newBenefit = new DeathFund({
      benefit: "deathfund",
      memberId,
      epfNumber,
      personType,
      amount,
      date,
      additionalNotes,
    });

    const savedBenefit = await newBenefit.save();

    await Member.findByIdAndUpdate(
      memberId,
      { $push: { benefits: savedBenefit._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Fund created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create fund",
      error: error.message,
    });
  }
};

// @desc View All Death Funds
// @route GET /api/deathfunds
// @access Private (Admin)
export const viewAllDeathFunds = async (req, res) => {
  try {
    const benefits = await DeathFund.find();
    res.status(200).json(benefits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc View Single Death Fund
// @route GET /api/deathfunds/:id
// @access Private (Admin/Member)
export const viewSingleDeathFund = async (req, res) => {
  try {
    const benefit = await DeathFund.findById(req.params.id);
    if (!benefit) {
      return res.status(404).json({ error: "Death fund not found..!" });
    }
    res.status(200).json(benefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Update Death Fund
// @route PUT /api/deathfunds/:id
// @access Private (Admin)
export const updateDeathFund = async (req, res) => {
  try {
    const updatedBenefit = await DeathFund.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBenefit) {
      return res.status(404).json({ error: "Death fund not found !" });
    }
    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete Death Fund
// @route DELETE /api/deathfunds/:id
// @access Private (Admin)
export const deleteDeathFund = async (req, res) => {
  try {
    const benefit = await DeathFund.findByIdAndDelete(req.params.id);
    if (!benefit) {
      return res.status(404).json({ error: "Death fund not found" });
    }

    await Member.findByIdAndUpdate(
      benefit.memberId,
      { $pull: { benefits: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      message:
        "Death fund deleted successfully and removed from member benefits",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
