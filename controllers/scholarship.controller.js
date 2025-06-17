import Scholarship from "../models/scholarship.model.js";
import Member from "../models/member.model.js";
import Logger from "../utils/Logger.js";

// @desc Create a Scholarship
// @route POST /api/scholarships
// @access Private (Admin/Member)
export const createScholarship = async (req, res) => {
  try {
    const { epf, indexNumber, amount } = req.body;

    const newBenefit = new Scholarship({
      benefit: "scholarship",
      epf,
      indexNumber,
      amount,
    });

    const savedBenefit = await newBenefit.save();

    const updatedMember = await Member.findOneAndUpdate(
      { epf },
      { $push: { scholarships: savedBenefit._id } },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({
        message: "Member not found with the provided EPF Number",
      });
    }

    await Logger.info(req.user._id, "Create", `Created scholarship for EPF: ${epf}`, savedBenefit._id, req.ip);

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

// @desc View All Scholarships
// @route GET /api/scholarships
// @access Private (Admin)
export const viewAllScholarships = async (req, res) => {
  try {
    const benefits = await Scholarship.find();

    await Logger.info(req.user._id, "Read", "Viewed all scholarships", null, req.ip);

    res.status(200).json(benefits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc View Single Scholarship
// @route GET /api/scholarships/:id
// @access Private (Admin/Member)
export const viewSingleScholarship = async (req, res) => {
  try {
    const benefit = await Scholarship.findById(req.params.id);
    if (!benefit) {
      return res.status(404).json({ message: "Scholarship not found!" });
    }

    await Logger.info(req.user._id, "Read", `Viewed scholarship ID: ${req.params.id}`, req.params.id, req.ip);

    res.status(200).json(benefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Update Scholarship
// @route PUT /api/scholarships/:id
// @access Private (Admin)
export const updateScholarship = async (req, res) => {
  try {
    const updatedBenefit = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBenefit) {
      return res.status(404).json({ message: "Scholarship not found!" });
    }

    await Logger.info(req.user._id, "Update", `Updated scholarship ID: ${req.params.id}`, req.params.id, req.ip);

    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete Scholarship
// @route DELETE /api/scholarships/:id
// @access Private (Admin)
export const deleteScholarship = async (req, res) => {
  try {
    const benefit = await Scholarship.findByIdAndDelete(req.params.id);
    if (!benefit) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    await Member.findOneAndUpdate(
      { epf: benefit.epf },
      { $pull: { scholarships: req.params.id } },
      { new: true }
    );

    await Logger.info(req.user._id, "Delete", `Deleted scholarship ID: ${req.params.id}`, req.params.id, req.ip);

    res.status(200).json({
      message: "Scholarship deleted successfully and removed from member benefits",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Get Scholarships by User ID
// @route GET /api/scholarships/benefits/:userId
// @access Private (Admin/Member)
export const getBenefitsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const member = await Member.findById(userId).populate("scholarships");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await Logger.info(req.user._id, "Read", `Viewed scholarships for user: ${userId}`, userId, req.ip);

    res.status(200).json({
      message: "Benefits retrieved successfully",
      benefits: member.scholarships,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve benefits.",
      error: error.message,
    });
  }
};
