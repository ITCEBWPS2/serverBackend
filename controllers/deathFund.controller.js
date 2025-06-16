import DeathFund from "../models/deathFund.model.js";
import Member from "../models/member.model.js";
import Logger from "../utils/logger.js";

// @desc Create a Death Fund
// @route POST /api/deathfunds
// @access Private (Admin/Member)
export const createDeathFund = async (req, res) => {
  try {
    const { epf, personType, amount, date, additionalNotes } = req.body;

    const newBenefit = new DeathFund({
      benefit: "deathfund",
      epf,
      personType,
      amount,
      date,
      additionalNotes,
    });

    const savedBenefit = await newBenefit.save();

    const updatedMember = await Member.findOneAndUpdate(
      { epf },
      { $push: { deathFunds: savedBenefit._id } },
      { new: true }
    );

    if (!updatedMember) {
      await Logger.warn("com.ceb.deathfundctrl.createDeathFund", "Member not found when creating death fund", null, {
        epf,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(404).json({
        message: "Member not found with the provided EPF Number",
      });
    }

    await Logger.info("com.ceb.deathfundctrl.createDeathFund", "Death fund created and linked successfully", updatedMember._id, {
      epf,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(201).json({
      message: "Fund created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    await Logger.error("com.ceb.deathfundctrl.createDeathFund", "Error creating death fund - " + error.message, null, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
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

    await Logger.info("com.ceb.deathfundctrl.viewAllDeathFunds", "Fetched all death funds", null, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json(benefits);
  } catch (error) {
    await Logger.error("com.ceb.deathfundctrl.viewAllDeathFunds", "Error fetching all death funds - " + error.message, null, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

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
      await Logger.warn("com.ceb.deathfundctrl.viewSingleDeathFund", "Death fund not found", null, {
        id: req.params.id,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(404).json({ error: "Death fund not found..!" });
    }

    await Logger.info("com.ceb.deathfundctrl.viewSingleDeathFund", "Fetched single death fund", null, {
      id: req.params.id,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json(benefit);
  } catch (error) {
    await Logger.error("com.ceb.deathfundctrl.viewSingleDeathFund", "Error fetching single death fund - " + error.message, null, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

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
      await Logger.warn("com.ceb.deathfundctrl.updateDeathFund", "Death fund not found for update", null, {
        id: req.params.id,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(404).json({ error: "Death fund not found !" });
    }

    await Logger.info("com.ceb.deathfundctrl.updateDeathFund", "Updated death fund", null, {
      id: req.params.id,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json(updatedBenefit);
  } catch (error) {
    await Logger.error("com.ceb.deathfundctrl.updateDeathFund", "Error updating death fund - " + error.message, null, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

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
      await Logger.warn("com.ceb.deathfundctrl.deleteDeathFund", "Death fund not found for deletion", null, {
        id: req.params.id,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(404).json({ error: "Death fund not found" });
    }

    await Member.findOneAndUpdate(
      { epf: benefit.epf },
      { $pull: { deathFunds: req.params.id } },
      { new: true }
    );

    await Logger.info("com.ceb.deathfundctrl.deleteDeathFund", "Deleted death fund", null, {
      id: req.params.id,
      epf: benefit.epf,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json({
      message:
        "Death fund deleted successfully and removed from member benefits",
    });
  } catch (error) {
    await Logger.error("com.ceb.deathfundctrl.deleteDeathFund", "Error deleting death fund - " + error.message, null, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(400).json({ error: error.message });
  }
};

// @desc Get Death Funds by User ID
// @route GET /api/deathfunds/benefits/:userId
// @access Private (Admin/Member)
export const getBenefitsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const member = await Member.findById(userId).populate("deathFunds");

    if (!member) {
      await Logger.warn("com.ceb.deathfundctrl.getBenefitsByUserId", "Member not found for benefits fetch", userId, {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(404).json({ message: "Member not found" });
    }

    await Logger.info("com.ceb.deathfundctrl.getBenefitsByUserId", "Retrieved death fund benefits by user", userId, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json({
      message: "Benefits retrieved successfully",
      benefits: member.deathFunds,
    });
  } catch (error) {
    await Logger.error("com.ceb.deathfundctrl.getBenefitsByUserId", "Error retrieving benefits - " + error.message, null, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(500).json({
      message: "Failed to retrieve benefits.",
      error: error.message,
    });
  }
};
