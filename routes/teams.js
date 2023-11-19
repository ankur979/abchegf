// routes/team.js
const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Team = require("../models/teams");

// Create a team
router.post("/team", async (req, res) => {
  try {
    const teamMembers = req.body.members; // Assuming the client sends an array of user IDs as members

    const selectedUsers = await User.find({ _id: { $in: teamMembers } });

    const isTeamValid = isTeamValidForCreation(selectedUsers);

    if (!isTeamValid) {
      return res
        .status(400)
        .json({
          message:
            "Invalid team selection. Ensure unique domains and availability.",
        });
    }

    await Team.create({ members: selectedUsers });

    res
      .status(201)
      .json({ message: "Team created successfully", team: selectedUsers });
  } catch (error) {
    console.error("Error creating team:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/team", async (req, res) => {
  try {
    const team = await Team.find();
    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/team/:id", async (req, res) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId).populate("members");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    console.error("Error fetching team details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to check if a team is valid for creation
function isTeamValidForCreation(teamMembers) {
  const domains = new Set();
  const availability = new Set();

  for (const member of teamMembers) {
    if (domains.has(member.domain) || availability.has(member.available)) {
      return false; // Not valid if domain or availability is not unique
    }

    domains.add(member.domain);
    availability.add(member.available);
  }

  return true;
}

module.exports = router;
