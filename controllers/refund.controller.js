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
      await Logger.warn(
        "com.ceb.refundctrl.createRefund",
        "Member not found with the provided EPF number",
        req.user?._id || null,
        { epf, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({
        message: "Member not found with the provided EPF Number",
      });
    }

    await Logger.info(
      "com.ceb.refundctrl.createRefund",
      `Created refund for EPF: ${epf}`,
      req.user?._id || null,
      { benefitId: savedBenefit._id, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(201).json({
      message: "Refund created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    await Logger.error(
      "com.ceb.refundctrl.createRefund",
      "Failed to create refund - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );
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

    await Logger.info(
      "com.ceb.refundctrl.viewAllRefunds",
      "Viewed all refund records",
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json(benefits);
  } catch (error) {
    await Logger.error(
      "com.ceb.refundctrl.viewAllRefunds",
      "Failed to view all refunds - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );
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
      await Logger.warn(
        "com.ceb.refundctrl.viewSingleRefund",
        "Refund not found",
        req.user?._id || null,
        { refundId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ error: "Refund not found" });
    }

    await Logger.info(
      "com.ceb.refundctrl.viewSingleRefund",
      `Viewed refund ID: ${req.params.id}`,
      req.user?._id || null,
      { refundId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json(benefit);
  } catch (error) {
    await Logger.error(
      "com.ceb.refundctrl.viewSingleRefund",
      "Failed to view single refund - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );
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
      await Logger.warn(
        "com.ceb.refundctrl.updateRefund",
        "Refund not found for update",
        req.user?._id || null,
        { refundId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ error: "Refund not found" });
    }

    await Logger.info(
      "com.ceb.refundctrl.updateRefund",
      `Updated refund ID: ${req.params.id}`,
      req.user?._id || null,
      { refundId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json(updatedBenefit);
  } catch (error) {
    await Logger.error(
      "com.ceb.refundctrl.updateRefund",
      "Failed to update refund - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );
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
      await Logger.warn(
        "com.ceb.refundctrl.deleteRefund",
        "Refund not found for deletion",
        req.user?._id || null,
        { refundId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ error: "Refund not found" });
    }

    await Member.findOneAndUpdate(
      { epf: benefit.epf },
      { $pull: { refunds: req.params.id } },
      { new: true }
    );

    await Logger.info(
      "com.ceb.refundctrl.deleteRefund",
      `Deleted refund ID: ${req.params.id}`,
      req.user?._id || null,
      { refundId: req.params.id, epf: benefit.epf, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json({
      message: "Refund deleted successfully and removed from member benefits",
    });
  } catch (error) {
    await Logger.error(
      "com.ceb.refundctrl.deleteRefund",
      "Failed to delete refund - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );
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
      await Logger.warn(
        "com.ceb.refundctrl.getBenefitsByUserId",
        "Member not found for benefits fetch",
        req.user?._id || null,
        { userId, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ message: "Member not found" });
    }

    await Logger.info(
      "com.ceb.refundctrl.getBenefitsByUserId",
      `Viewed refunds for user ID: ${userId}`,
      req.user?._id || null,
      { userId, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json({
      message: "Benefits retrieved successfully",
      benefits: member.refunds,
    });
  } catch (error) {
    await Logger.error(
      "com.ceb.refundctrl.getBenefitsByUserId",
      "Failed to retrieve refunds - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );
    res.status(500).json({
      message: "Failed to retrieve benefits.",
      error: error.message,
    });
  }
};
