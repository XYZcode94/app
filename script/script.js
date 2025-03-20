document.addEventListener("DOMContentLoaded", () => {
  const joinButton = document.querySelector("#joinNowBtn");

  if (joinButton) {
    joinButton.addEventListener("click", showEmailPopup);
  }
});

function showEmailPopup() {
  if (document.querySelector(".email-popup")) return; // Prevent multiple popups

  const popup = document.createElement("div");
  popup.className = "email-popup";
  popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">&times;</span>
            <h3>Join CODEXIS</h3>
            <p>Please enter your email to join our coding community:</p>
            <form id="joinForm">
                <input type="email" id="joinEmail" placeholder="Your Email" required>
                <button type="submit">Submit</button>
            </form>
        </div>
    `;

  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add("active");
  }, 10);

  popup
    .querySelector(".close-popup")
    .addEventListener("click", () => closeEmailPopup(popup));

  // Handle form submission **WITHOUT REDIRECT & AUTO CLOSE POPUP**
  popup.querySelector("#joinForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = popup.querySelector("#joinEmail").value.trim();

    if (!email) {
      showAlert("⚠️ Please enter a valid email address.", "error");
      return;
    }

    const submitButton = popup.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const response = await fetch("https://formspree.io/f/mbldnjpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showAlert(
          `✅ Thank you for joining CODEXIS! Confirmation sent to ${email}.`,
          "success",
          true
        );

        // **Add fade-out class, then remove popup**
        popup.classList.add("fade-out");
        setTimeout(() => {
          closeEmailPopup(popup);
        }, 1000);
      } else {
        showAlert("❌ Error sending email. Please try again.", "error");
      }
    } catch (error) {
      showAlert("⚠️ Network error. Check your connection.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });
}

function closeEmailPopup(popup) {
  popup.classList.remove("active");

  // **Ensure popup fully disappears**
  setTimeout(() => {
    popup.remove();
  }, 300);
}

// Alert function to show messages
function showAlert(message, type = "info", autoRemove = false) {
  document.querySelectorAll(".alert").forEach((alert) => alert.remove()); // Prevent multiple alerts

  const alertBox = document.createElement("div");
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
  document.body.appendChild(alertBox);

  if (autoRemove) {
    setTimeout(() => {
      alertBox.remove();
    }, 3000); // Message disappears after 3 seconds
  }
}

function isValidMessage(message) {
  // Ensure at least 5 words are present
  const words = message.trim().split(/\s+/);
  if (words.length < 5) {
    return false;
  }

  // Ensure the message contains meaningful text (not just numbers/symbols)
  if (!/[a-zA-Z]/.test(message)) {
    return false;
  }

  // Ensure the message is not repetitive (e.g., "aaaaa" or "123123")
  if (/^(.)\1+$/.test(message)) {
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  // Handle Contact Form Submission with Formspree Integration
  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const formData = {
        name: document.querySelector("#name").value.trim(),
        email: document.querySelector("#email").value.trim(),
        message: document.querySelector("#message").value.trim(),
      };

      if (!formData.name || !formData.email || !formData.message) {
        showAlert("⚠️ Please fill out all fields.", "error");
        return;
      }

      const submitButton = form.querySelector("button");
      const formStatus = document.getElementById("form-status");

      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        const response = await fetch("https://formspree.io/f/mbldnjpp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!isValidMessage(formData.message)) {
          showAlert(
            "⚠️ Please enter a meaningful message (at least 5 words).",
            "error"
          );
          return;
        }

        if (response.ok) {
          showAlert("✅ Message sent successfully!", "success");
          form.reset(); // Clear form fields
          formStatus.textContent = "Message sent successfully!";
          formStatus.style.color = "green";
          formStatus.style.display = "block";
          // Hide the message after 3 seconds
          setTimeout(() => {
            formStatus.style.display = "none";
          }, 3000);
        } else {
          showAlert("❌ Error sending message. Try again later.", "error");
          formStatus.textContent = "Error submitting the form.";
          formStatus.style.color = "red";
          formStatus.style.display = "block";
          // Hide the message after 3 seconds
          setTimeout(() => {
            formStatus.style.display = "none";
          }, 3000);
        }
      } catch (error) {
        console.error("Submission Error:", error);
        showAlert("⚠️ Network error. Check your connection.", "error");
        // Hide the message after 3 seconds
        setTimeout(() => {
          formStatus.style.display = "none";
        }, 3000);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send";
      }
    });
  }
});

// Utility function for alerts
function showAlert(message, type = "info") {
  const alertBox = document.createElement("div");
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}

// Handle popular pages tooltips
document.querySelectorAll('#pra strong[data-popular]').forEach(popularLink => {
    const tooltip = document.createElement('div');
    tooltip.className = 'popular-tooltip';
    document.body.appendChild(tooltip);

    let tooltipTimeout;
    let isTooltipVisible = false;

    popularLink.addEventListener('mouseenter', e => {
        clearTimeout(tooltipTimeout);
        const rect = popularLink.getBoundingClientRect();
        const pageTitle = popularLink.getAttribute('data-title');
        const pageViews = popularLink.getAttribute('data-views');
        const url = popularLink.getAttribute('data-url');
        
        // Create tooltip content with page info and stats
        tooltip.innerHTML = `
            <div class="popular-page-info">
                <h4>${pageTitle}</h4>
                ${pageViews ? `<span class="view-count">👁 ${pageViews} views</span>` : ''}
                ${url ? `<a href="${url}" class="visit-page" target="_blank" rel="noopener noreferrer">Visit Page →</a>` : ''}
            </div>
        `;
        
        // Get viewport and scroll dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Get tooltip dimensions after content is set
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Calculate position relative to viewport
        let left = rect.left + (rect.width - tooltipRect.width) / 2;
        let top = rect.bottom + 10;

        // Smart positioning logic
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const tooltipGoesBelow = spaceBelow >= tooltipRect.height + 10;

        if (!tooltipGoesBelow && spaceAbove >= tooltipRect.height + 10) {
            top = rect.top - tooltipRect.height - 10;
            tooltip.setAttribute('data-position', 'top');
        } else {
            tooltip.setAttribute('data-position', 'bottom');
        }

        // Keep tooltip within horizontal bounds
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        if (left < 10) {
            left = 10;
        }

        // Apply final position with smooth animation
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top + scrollY}px`;
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        isTooltipVisible = true;

        // Add highlight effect to popular link
        popularLink.style.backgroundColor = 'rgba(0, 200, 83, 0.1)';
        popularLink.style.borderBottom = '1px solid #00c853';
    });

    popularLink.addEventListener('mouseleave', e => {
        tooltipTimeout = setTimeout(() => {
            if (!isTooltipVisible) return;
            
            const tooltipRect = tooltip.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            if (
                mouseX >= tooltipRect.left &&
                mouseX <= tooltipRect.right &&
                mouseY >= tooltipRect.top &&
                mouseY <= tooltipRect.bottom
            ) {
                return;
            }
            
            hideTooltip();
        }, 100);
    });

    tooltip.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
    });

    tooltip.addEventListener('mouseleave', () => {
        hideTooltip();
    });

    function hideTooltip() {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        isTooltipVisible = false;
        popularLink.style.backgroundColor = '';
        popularLink.style.borderBottom = '1px dotted var(--primary-color)';
    }
});

// Handle navigation and progress bar
document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progress-bar");
    const content = document.body;

    // Start loading animation
    function startLoading() {
        progressBar.style.width = "0%";
        progressBar.style.opacity = "1";
        progressBar.style.transition = "none";
        content.classList.add("loading-active");

        requestAnimationFrame(() => {
            progressBar.style.transition = "width 0.3s ease-in-out";
            progressBar.style.width = "85%";
        });
    }

    // Finish loading animation
    function finishLoading() {
        progressBar.style.width = "100%";

        setTimeout(() => {
            progressBar.style.opacity = "0";
            progressBar.style.transition = "opacity 0.2s linear";
            
            setTimeout(() => {
                progressBar.style.width = "0%";
                content.classList.remove("loading-active");
            }, 200);
        }, 300);
    }

    // Handle all internal links
    document.querySelectorAll("a").forEach(link => {
        if (!link.hasAttribute('target') || link.target !== '_blank') {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('mailto:')) {
                    startLoading();
                }
            });
        }
    });

    // Handle page load
    window.addEventListener("load", finishLoading);
});

// Event page specific handlers
document.addEventListener("DOMContentLoaded", function() {
    const eventHandlers = {
        'hackthon_div': '/hackthon_event.html',
        'Ai_Ml_inovaction': '/Ai_Ml_inovaction.html',
        'Web_Dev': '/Web_Dev.html',
        'Cybersecurity': '/Cybersecurity.html'
    };

    Object.entries(eventHandlers).forEach(([id, url]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("click", function() {
                window.open(url, "_blank");
            });
        }
    });
});

// Prevent tooltip from getting stuck on touch devices
document.addEventListener('touchstart', () => {
    const tooltips = document.querySelectorAll('.reference-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });
});

// Handle reference tooltips with genuine sources
document.querySelectorAll('#pra strong[data-reference]').forEach(reference => {
    const tooltip = document.createElement('div');
    tooltip.className = 'reference-tooltip';
    document.body.appendChild(tooltip);

    let tooltipTimeout;
    let isTooltipVisible = false;

    reference.addEventListener('mouseenter', e => {
        clearTimeout(tooltipTimeout);
        const rect = reference.getBoundingClientRect();
        const referenceText = reference.getAttribute('data-reference');
        const url = reference.getAttribute('data-url');
        const author = reference.getAttribute('data-author');
        const date = reference.getAttribute('data-date');
        
        // Create tooltip content with reference and metadata
        tooltip.innerHTML = `
            <div class="reference-content">
                <p class="reference-text">${referenceText}</p>
                ${author ? `<p class="reference-author">By ${author}</p>` : ''}
                ${date ? `<p class="reference-date">${date}</p>` : ''}
                ${url ? `
                    <div class="reference-link">
                        <a href="${url}" class="reference-source" target="_blank" rel="noopener noreferrer">
                            Read Article →
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Get viewport and scroll dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Get tooltip dimensions after content is set
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Calculate position relative to viewport
        let left = rect.left + (rect.width - tooltipRect.width) / 2;
        let top = rect.bottom + 10;

        // Smart positioning logic
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const tooltipGoesBelow = spaceBelow >= tooltipRect.height + 10;

        if (!tooltipGoesBelow && spaceAbove >= tooltipRect.height + 10) {
            top = rect.top - tooltipRect.height - 10;
            tooltip.setAttribute('data-position', 'top');
        } else {
            tooltip.setAttribute('data-position', 'bottom');
        }

        // Keep tooltip within horizontal bounds
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        if (left < 10) {
            left = 10;
        }

        // Apply final position with smooth animation
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top + scrollY}px`;
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        isTooltipVisible = true;

        // Add highlight effect to reference
        reference.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        reference.style.borderBottom = '1px solid #f44336';
    });

    reference.addEventListener('mouseleave', e => {
        tooltipTimeout = setTimeout(() => {
            if (!isTooltipVisible) return;
            
            const tooltipRect = tooltip.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            if (
                mouseX >= tooltipRect.left &&
                mouseX <= tooltipRect.right &&
                mouseY >= tooltipRect.top &&
                mouseY <= tooltipRect.bottom
            ) {
                return;
            }
            
            hideTooltip();
        }, 100);
    });

    tooltip.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
    });

    tooltip.addEventListener('mouseleave', () => {
        hideTooltip();
    });

    function hideTooltip() {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        isTooltipVisible = false;
        reference.style.backgroundColor = '';
        reference.style.borderBottom = '1px dotted var(--primary-color)';
    }
});



document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector("nav");
  const icon = document.querySelector("#nav-icon");

  hamburger.addEventListener("click", () => {
      menu.classList.toggle("menu-active");

      if (icon.classList.contains("fa-bars")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-xmark");
          icon.style.color = "red";
      } else if (icon.classList.contains("fa-xmark")) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
          icon.style.color = "#000";
      } else {
          // Default to fa-bars if no relevant class is found
          icon.classList.add("fa-bars");
          icon.style.color = "#000";
      }
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const listItems = document.querySelectorAll("nav ul li");

  listItems.forEach((li) => {
      li.addEventListener("click", () => {
          const link = li.querySelector("a").getAttribute("href");
          if (link) {
              window.location.href = link;
          }
      });
  });
});
