// enhanced-task-bars.js
// This script enhances task progress bars with client-side updates and improved visuals

(function() {
    // Task type colors - customize these as needed
    const taskTypeColors = {
        'fillPrescription': '#4caf50', // Green
        'customerInteraction': '#2196f3', // Blue
        'consultation': '#9c27b0', // Purple
        'compound': '#ff9800', // Orange
        'production': '#795548', // Brown
        'default': '#607d8b' // Gray (fallback)
    };

    // Store tasks and their progress for client-side calculation
    let activeTasksCache = [];
    
    // Initialize task progress bars enhancement
    function initEnhancedTaskBars() {
        console.log("[enhanced-task-bars] Initializing enhanced progress bars");
        
        // Add necessary CSS to the page
        addTaskBarStyles();
        
        // First load the tasks
        updateTaskProgressBars();
        
        // Set interval for client-side progress updates
        setInterval(clientSideProgressUpdate, 1000); // Update every second
        
        // Actual data refresh from server at longer intervals
        setInterval(updateTaskProgressBars, 5000); // Fetch actual data every 5 seconds
    }
    
    // Update progress UI without fetching new data
    function clientSideProgressUpdate() {
        activeTasksCache.forEach(task => {
            if (task.status === 'inProgress') {
                // Estimate new progress based on time elapsed
                const now = Date.now();
                const elapsed = (now - task.lastUpdated) / 1000; // Seconds since last update
                
                // Calculate how much progress should have increased
                // Progress increases at the rate of totalTime / 60 per second
                const progressRate = task.totalTime / task.totalTime; // Progress units per second
                const estimatedProgress = Math.min(task.totalTime, task.progress + (elapsed * progressRate));
                
                // Update the progress bar
                const progressBar = document.querySelector(`.task-progress-bar[data-task-id="${task.id}"]`);
                if (progressBar) {
                    const fillElement = progressBar.querySelector('.progress-fill');
                    const percentElement = progressBar.querySelector('.progress-percent');
                    
                    // Calculate percentage
                    const percent = Math.min(100, Math.round((estimatedProgress / task.totalTime) * 100));
                    
                    // Update fill width
                    if (fillElement) {
                        fillElement.style.width = `${percent}%`;
                    }
                    
                    // Update percentage text
                    if (percentElement) {
                        percentElement.textContent = `${percent}%`;
                    }
                    
                    // Update time remaining
                    const timeElement = progressBar.querySelector('.time-remaining');
                    if (timeElement) {
                        const remainingTime = Math.max(0, task.totalTime - estimatedProgress);
                        const minutes = Math.floor(remainingTime);
                        const seconds = Math.floor((remainingTime - minutes) * 60);
                        timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
                    }
                    
                    // Store the estimated progress for next calculation
                    task.clientProgress = estimatedProgress;
                }
            }
        });
    }
    
    // Fetch tasks and update the progress bars
    function updateTaskProgressBars() {
        // Get all currently active tasks
        if (!window.taskManager || !window.taskManager.tasks) {
            return; // Skip if tasks not available yet
        }
        
        const activeTasks = window.taskManager.tasks.filter(t => 
            t.status === 'inProgress' && t.assignedTo
        );
        
        // Update our local cache with the current state
        activeTasksCache = activeTasks.map(task => ({
            ...task,
            lastUpdated: Date.now(),
            clientProgress: task.progress // Initialize client-side progress tracker
        }));
        
        // Get all employee task displays
        updateEmployeeTaskDisplays();
        
        // Get all standalone task displays if there are any
        updateStandaloneTaskDisplays();
    }
    
    // Update task displays within employee cards
    function updateEmployeeTaskDisplays() {
        const employeeTaskElements = document.querySelectorAll('.employee-card .task-section, .task-info');
        
        employeeTaskElements.forEach(taskElement => {
            const employeeId = taskElement.closest('[data-employee-id]')?.dataset.employeeId;
            if (!employeeId) return;
            
            const employee = window.employeesData.find(e => e.id === employeeId);
            if (!employee || !employee.currentTaskId) return;
            
            const task = window.taskManager.tasks.find(t => t.id === employee.currentTaskId);
            if (!task) return;
            
            // Replace the existing progress bar with our enhanced version
            replaceProgressBar(taskElement, task);
        });
    }
    
    // Update standalone task displays
    function updateStandaloneTaskDisplays() {
        const taskEntries = document.querySelectorAll('.task-entry');
        
        taskEntries.forEach(taskEntry => {
            const taskId = taskEntry.dataset.taskId;
            if (!taskId) return;
            
            const task = window.taskManager.tasks.find(t => t.id === taskId);
            if (!task || task.status !== 'inProgress') return;
            
            // Replace the existing progress bar with our enhanced version
            replaceProgressBar(taskEntry, task);
        });
    }
    
    // Replace a basic progress bar with our enhanced version
    function replaceProgressBar(container, task) {
        // Look for existing progress elements
        const existingProgress = container.querySelector('progress');
        const existingProgressContainer = container.querySelector('.progress-container');
        
        // If we already replaced this with our custom bar, just update it
        const existingCustomBar = container.querySelector('.task-progress-bar');
        if (existingCustomBar) {
            updateCustomProgressBar(existingCustomBar, task);
            return;
        }
        
        // If there was a native progress bar, remove it along with its container
        if (existingProgress) {
            const parent = existingProgress.parentElement;
            if (parent && parent.classList.contains('progress-container')) {
                parent.remove();
            } else {
                existingProgress.remove();
            }
        }
        
        // Create our custom progress bar
        const customBar = createCustomProgressBar(task);
        
        // Find the right place to insert it
        // If there was a progress-container, insert at that position
        if (existingProgressContainer) {
            container.insertBefore(customBar, existingProgressContainer.nextSibling);
        } else {
            // Otherwise add it to the end of the container
            container.appendChild(customBar);
        }
    }
    
    // Create a custom progress bar for a task
    function createCustomProgressBar(task) {
        const percent = Math.min(100, Math.round((task.progress / task.totalTime) * 100));
        
        // Get the color based on task type
        const color = taskTypeColors[task.type] || taskTypeColors.default;
        
        // Create the container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'task-progress-bar';
        progressContainer.dataset.taskId = task.id;
        
        // Create the progress track and fill
        const progressTrack = document.createElement('div');
        progressTrack.className = 'progress-track';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${percent}%`;
        progressFill.style.backgroundColor = color;
        
        progressTrack.appendChild(progressFill);
        progressContainer.appendChild(progressTrack);
        
        // Add percentage text
        const progressPercent = document.createElement('div');
        progressPercent.className = 'progress-percent';
        progressPercent.textContent = `${percent}%`;
        progressContainer.appendChild(progressPercent);
        
        // Time remaining
        const timeRemaining = document.createElement('div');
        timeRemaining.className = 'time-remaining';
        const remainingTime = task.totalTime - task.progress;
        const minutes = Math.floor(remainingTime);
        const seconds = Math.floor((remainingTime - minutes) * 60);
        timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
        progressContainer.appendChild(timeRemaining);
        
        // Add a tooltip with task details
        progressContainer.title = createTaskTooltip(task);
        
        return progressContainer;
    }
    
    // Update an existing custom progress bar
    function updateCustomProgressBar(progressBar, task) {
        const percent = Math.min(100, Math.round((task.progress / task.totalTime) * 100));
        
        // Get the color based on task type
        const color = taskTypeColors[task.type] || taskTypeColors.default;
        
        // Update the progress fill
        const progressFill = progressBar.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
            progressFill.style.backgroundColor = color;
        }
        
        // Update percentage text
        const progressPercent = progressBar.querySelector('.progress-percent');
        if (progressPercent) {
            progressPercent.textContent = `${percent}%`;
        }
        
        // Update time remaining
        const timeRemaining = progressBar.querySelector('.time-remaining');
        if (timeRemaining) {
            const remainingTime = task.totalTime - task.progress;
            const minutes = Math.floor(remainingTime);
            const seconds = Math.floor((remainingTime - minutes) * 60);
            timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
        }
        
        // Update tooltip
        progressBar.title = createTaskTooltip(task);
        
        // Update the task ID
        progressBar.dataset.taskId = task.id;
    }
    
    // Create a tooltip for a task
    function createTaskTooltip(task) {
        let tooltip = `Task: ${formatTaskType(task.type)}\n`;
        tooltip += `Progress: ${Math.round((task.progress / task.totalTime) * 100)}%\n`;
        tooltip += `Time Elapsed: ${task.progress.toFixed(1)} minutes\n`;
        tooltip += `Total Time: ${task.totalTime} minutes\n`;
        
        if (task.type === 'fillPrescription' && task.prescriptionId) {
            tooltip += `Prescription ID: ${task.prescriptionId}\n`;
        }
        
        if (task.customerId) {
            const customer = window.customers.getCustomerById(task.customerId);
            if (customer) {
                tooltip += `Customer: ${customer.firstName} ${customer.lastName}\n`;
            }
        }
        
        if (task.productId) {
            tooltip += `Product: ${task.productName || task.productId}\n`;
        }
        
        return tooltip;
    }
    
    // Format task type for display
    function formatTaskType(type) {
        if (!type) return 'Unknown';
        
        switch (type) {
            case 'fillPrescription': return 'Filling Prescription';
            case 'customerInteraction': return 'Customer Interaction';
            case 'consultation': return 'Consultation';
            case 'compound': return 'Compounding';
            case 'production': return 'Production';
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    }
    
    // Add CSS styles for the enhanced progress bars
    function addTaskBarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Custom progress bar styles */
            .task-progress-bar {
                margin: 10px 0;
                position: relative;
                font-size: 12px;
            }
            
            .progress-track {
                height: 10px;
                background-color: #f0f0f0;
                border-radius: 5px;
                overflow: hidden;
                position: relative;
            }
            
            .progress-fill {
                height: 100%;
                background-color: #4caf50; /* Default color, will be overridden */
                width: 0%; /* Will be set dynamically */
                border-radius: 5px;
                transition: width 0.5s ease-in-out;
            }
            
            .progress-percent {
                position: absolute;
                top: -16px;
                right: 0;
                font-size: 12px;
                font-weight: bold;
                color: #333;
            }
            
            .time-remaining {
                margin-top: 4px;
                font-size: 11px;
                color: #666;
                text-align: right;
            }
            
            /* Tooltip improvements for all browsers */
            [title] {
                position: relative;
                cursor: help;
            }
            
            /* Ensure task entries in the operations page correctly show the ID */
            .task-entry {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize when the page loads
    window.addEventListener('DOMContentLoaded', function() {
        // Check if we're on the operations page and delay a bit to ensure the UI is rendered
        setTimeout(initEnhancedTaskBars, 1000);
    });
    
    // Also initialize if the page changes to operations
    document.addEventListener('pageChanged', function(e) {
        if (e.detail && e.detail.page === 'operations') {
            setTimeout(initEnhancedTaskBars, 1000);
        }
    });
    
    // Export the initialization function for manual use
    window.initEnhancedTaskBars = initEnhancedTaskBars;
    
    // Monkey patch the showPage function to detect page changes
    const originalShowPage = window.showPage;
    if (originalShowPage) {
        window.showPage = function(pageName) {
            originalShowPage(pageName);
            
            // Dispatch a custom event for page changes
            const event = new CustomEvent('pageChanged', { 
                detail: { page: pageName } 
            });
            document.dispatchEvent(event);
        };
    }
    
    // Attempt to initialize on load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initEnhancedTaskBars, 1000);
    }
})();