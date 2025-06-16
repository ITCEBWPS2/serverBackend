import Refund from "../models/refund.model.js";
import Member from "../models/member.model.js";
import Logger from "../utils/Logger.js";

// @desc Create a Refund
// @route POST /api/refunds
// @access Private (Admin/Member)
export const createRefund = async (req, res) => {
  try {
    const { epf, amount, reason, message } = req.body;

    const newBenefit = new Refund({
      benefit: "refund",
      epf,
      amount,
      reason,
      message,
    });

    const savedBenefit = await newBenefit.save();

    const updatedMember = await Member.findOneAndUpdate(
      { epf },
      { $push: { refunds: savedBenefit._id } },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({
        message: "Member not found with the provided EPF Number",
      });
    }

    await Logger.info(req.user._id, "Create", `Created refund for EPF: ${epf}`, savedBenefit._id, req.ip);

    res.status(201).json({
      message: "Refund created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create Refund.",
      error: error.message,
    });
  }
};

// @desc View All Refunds
// @route GET /api/refunds
// @access Private (Admin)
export const viewAllRefunds = async (req, res) => {
  try {
    const benefits = await Refund.find();

    await Logger.info(req.user._id, "Read", "Viewed all refund records", null, req.ip);

    res.status(200).json(benefits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc View Single Refund
// @route GET /api/refunds/:id
// @access Private (Admin/Member)
export const viewSingleRefund = async (req, res) => {
  try {
    const benefit = await Refund.findById(req.params.id);
    if (!benefit) {
      return res.status(404).json({ error: "Refund not found..!" });
    }

    await Logger.info(req.user._id, "Read", `Viewed single refund: ${req.params.id}`, req.params.id, req.ip);

    res.status(200).json(benefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Update Refund
// @route PUT /api/refunds/:id
// @access Private (Admin)
export const updateRefund = async (req, res) => {
  try {
    const updatedBenefit = await Refund.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBenefit) {
      return res.status(404).json({ error: "Refund not found !" });
    }

    await Logger.info(req.user._id, "Update", `Updated refund ID: ${req.params.id}`, req.params.id, req.ip);

    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete Refund
// @route DELETE /api/refunds/:id
// @access Private (Admin)
export const deleteRefund = async (req, res) => {
  try {
    const benefit = await Refund.findByIdAndDelete(req.params.id);
    if (!benefit) {
      return res.status(404).json({ error: "Refund not found" });
    }

    await Member.findOneAndUpdate(
      { epf: benefit.epf },
      { $pull: { refunds: req.params.id } },
      { new: true }
    );

    await Logger.info(req.user._id, "Delete", `Deleted refund ID: ${req.params.id}`, req.params.id, req.ip);

    res.status(200).json({
      message: "Refund deleted successfully and removed from member benefits",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Get Refunds by User ID
// @route GET /api/refunds/benefits/:userId
// @access Private (Admin/Member)
export const getBenefitsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const member = await Member.findById(userId).populate("refunds");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await Logger.info(req.user._id, "Read", `Viewed refunds for user: ${userId}`, userId, req.ip);

    res.status(200).json({
      message: "Benefits retrieved successfully",
      benefits: member.refunds,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve benefits.",
      error: error.message,
    });
  }
};
