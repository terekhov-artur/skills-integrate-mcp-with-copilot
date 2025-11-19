document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");

    const activity = button.getAttribute("data-activity");
    const email = button.getAttribute("data-email");

    try {
      const response = await fetch(
    const searchInput = document.getElementById("activity-search");
    const sortSelect = document.getElementById("activity-sort");
    let allActivities = {};
        `/activities/${encodeURIComponent(
    // Render activities with filter, sort, and search
    function renderActivities(activities) {
      // Get search and sort values
      const search = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const sort = sortSelect ? sortSelect.value : "name";

      // Filter
      let filtered = Object.entries(activities).filter(([name, details]) => {
        return (
          name.toLowerCase().includes(search) ||
          details.description.toLowerCase().includes(search)
        );
      });

      // Sort
      filtered.sort((a, b) => {
        if (sort === "name") {
          return a[0].localeCompare(b[0]);
        } else if (sort === "spots") {
          const spotsA = a[1].max_participants - a[1].participants.length;
          const spotsB = b[1].max_participants - b[1].participants.length;
          return spotsB - spotsA;
        }
        return 0;
      });

      // Clear list
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      filtered.forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";
        const spotsLeft = details.max_participants - details.participants.length;
        const participantsHTML =
          details.participants.length > 0
            ? `<div class="participants-section">
                <h5>Participants:</h5>
                <ul class="participants-list">
                  ${details.participants
                    .map(
                      (email) =>
                        `<li><span class="participant-email">${email}</span><button class="delete-btn" data-activity="${name}" data-email="${email}">❌</button></li>`
                    )
                    .join("")}
                </ul>
              </div>`
            : `<p><em>No participants yet</em></p>`;
        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-container">
            ${participantsHTML}
          </div>
        `;
        activitiesList.appendChild(activityCard);
        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleUnregister);
      });
    }

    // Fetch activities and store for filtering
    async function fetchActivities() {
      try {
        const response = await fetch("/activities");
        allActivities = await response.json();
        renderActivities(allActivities);
      } catch (error) {
        activitiesList.innerHTML =
          "<p>Failed to load activities. Please try again later.</p>";
        console.error("Error fetching activities:", error);
      }
    }
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Event listeners for filter/sort/search
  if (searchInput) {
    searchInput.addEventListener("input", () => renderActivities(allActivities));
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", () => renderActivities(allActivities));
  }

  // Initialize app
  fetchActivities();
});
