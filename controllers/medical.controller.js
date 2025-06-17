import Medical from "../models/medical.model.js";
import Member from "../models/member.model.js";
import Logger from "../utils/Logger.js";

// @desc Create a Medical
// @route POST /api/medicals
// @access Private (Admin/Member)
export const createMedical = async (req, res) => {
  try {
    const { epf, date, reason } = req.body;

    const newBenefit = new Medical({
      benefit: "medical",
      epf,
      date,
      reason,
    });

    const savedBenefit = await newBenefit.save();

    const updatedMember = await Member.findOneAndUpdate(
      { epf },
      { $push: { medicals: savedBenefit._id } },
      { new: true }
    );

    if (!updatedMember) {
      await Logger.warn(
        "com.ceb.medicalctrl.createMedical",
        "Member not found with the provided EPF number",
        req.user?._id || null,
        { epf, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({
        message: "Member not found with the provided EPF number",
      });
    }

    await Logger.info(
      "com.ceb.medicalctrl.createMedical",
      `Created medical benefit for EPF: ${epf}`,
      req.user?._id || null,
      {
        benefitId: savedBenefit._id,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      }
    );

    res.status(201).json({
      message: "Medical created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    await Logger.error(
      "com.ceb.medicalctrl.createMedical",
      "Failed to create medical benefit - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(500).json({
      message: "Failed to create medical",
      error: error.message,
    });
  }
};

// @desc View All Medicals
// @route GET /api/medicals
// @access Private (Admin)
export const viewAllMedicals = async (req, res) => {
  try {
    const benefits = await Medical.find();

    await Logger.info(
      "com.ceb.medicalctrl.viewAllMedicals",
      "Viewed all medical records",
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json(benefits);
  } catch (error) {
    await Logger.error(
      "com.ceb.medicalctrl.viewAllMedicals",
      "Failed to view all medicals - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(400).json({ error: error.message });
  }
};

// @desc View Single Medical
// @route GET /api/medicals/:id
// @access Private (Admin/Member)
export const viewSingleMedical = async (req, res) => {
  try {
    const benefit = await Medical.findById(req.params.id);
    if (!benefit) {
      await Logger.warn(
        "com.ceb.medicalctrl.viewSingleMedical",
        "Medical record not found",
        req.user?._id || null,
        { medicalId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ error: "Medical not found" });
    }

    await Logger.info(
      "com.ceb.medicalctrl.viewSingleMedical",
      `Viewed medical record ID: ${req.params.id}`,
      req.user?._id || null,
      { medicalId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json(benefit);
  } catch (error) {
    await Logger.error(
      "com.ceb.medicalctrl.viewSingleMedical",
      "Failed to view single medical - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(400).json({ error: error.message });
  }
};

// @desc Update Medical
// @route PUT /api/medicals/:id
// @access Private (Admin)
export const updateMedical = async (req, res) => {
  try {
    const updatedBenefit = await Medical.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBenefit) {
      await Logger.warn(
        "com.ceb.medicalctrl.updateMedical",
        "Medical record not found for update",
        req.user?._id || null,
        { medicalId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ error: "Medical not found" });
    }

    await Logger.info(
      "com.ceb.medicalctrl.updateMedical",
      `Updated medical record ID: ${req.params.id}`,
      req.user?._id || null,
      { medicalId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json(updatedBenefit);
  } catch (error) {
    await Logger.error(
      "com.ceb.medicalctrl.updateMedical",
      "Failed to update medical - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(400).json({ error: error.message });
  }
};

// @desc Delete Medical
// @route DELETE /api/medicals/:id
// @access Private (Admin)
export const deleteMedical = async (req, res) => {
  try {
    const benefit = await Medical.findByIdAndDelete(req.params.id);
    if (!benefit) {
      await Logger.warn(
        "com.ceb.medicalctrl.deleteMedical",
        "Medical record not found for deletion",
        req.user?._id || null,
        { medicalId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ error: "Medical not found" });
    }

    await Member.findOneAndUpdate(
      { epf: benefit.epf },
      { $pull: { medicals: req.params.id } },
      { new: true }
    );

    await Logger.info(
      "com.ceb.medicalctrl.deleteMedical",
      `Deleted medical record ID: ${req.params.id}`,
      req.user?._id || null,
      { medicalId: req.params.id, epf: benefit.epf, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json({
      message: "Medical deleted successfully and removed from member benefits",
    });
  } catch (error) {
    await Logger.error(
      "com.ceb.medicalctrl.deleteMedical",
      "Failed to delete medical - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(400).json({ error: error.message });
  }
};

// @desc Get Medicals by User ID
// @route GET /api/medicals/benefits/:userId
// @access Private (Admin/Member)
export const getBenefitsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const member = await Member.findById(userId).populate("medicals");

    if (!member) {
      await Logger.warn(
        "com.ceb.medicalctrl.getBenefitsByUserId",
        "Member not found for benefits fetch",
        req.user?._id || null,
        { userId, ip: req.ip, userAgent: req.get("User-Agent") }
      );
      return res.status(404).json({ message: "Member not found" });
    }

    await Logger.info(
      "com.ceb.medicalctrl.getBenefitsByUserId",
      `Viewed medical benefits for user ID: ${userId}`,
      req.user?._id || null,
      { userId, ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(200).json({
      message: "Benefits retrieved successfully",
      benefits: member.medicals,
    });
  } catch (error) {
    await Logger.error(
      "com.ceb.medicalctrl.getBenefitsByUserId",
      "Failed to retrieve medical benefits - " + error.message,
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );

    res.status(500).json({
      message: "Failed to retrieve benefits.",
      error: error.message,
    });
  }
};
