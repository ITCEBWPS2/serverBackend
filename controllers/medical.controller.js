import Medical from "../models/medical.model.js";
import Member from "../models/member.model.js";

// @desc Create a Medical
// @route POST /api/medicals
// @access Private (Admin/Member)
export const createMedical = async (req, res) => {
  try {
    const { memberId, date, reason } = req.body;

    const newBenefit = new Medical({
      benefit: "medical",
      memberId,
      date,
      reason,
    });

    const savedBenefit = await newBenefit.save();

    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      { $push: { medicals: savedBenefit._id } },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({
        message: "Member not found with the provided ID",
      });
    }

    res.status(201).json({
      message: "Medical created and added to member successfully",
      benefit: savedBenefit,
    });
  } catch (error) {
    console.error(error);
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
    res.status(200).json(benefits);
  } catch (error) {
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
      return res.status(404).json({ error: "Medical not found..!" });
    }
    res.status(200).json(benefit);
  } catch (error) {
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
      return res.status(404).json({ error: "Medical not found !" });
    }
    res.status(200).json(updatedBenefit);
  } catch (error) {
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
      return res.status(404).json({ error: "Medical not found" });
    }

    await Member.findByIdAndUpdate(
      benefit.memberId,
      { $pull: { medicals: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      message: "Medical deleted successfully and removed from member benefits",
    });
  } catch (error) {
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
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({
      message: "Benefits retrieved successfully",
      benefits: member.medicals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve benefits.",
      error: error.message,
    });
  }
};
