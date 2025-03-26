class ExamSecurity {
    constructor() {
        this.activeSessions = new Map();
        this.loginAttempts = new Map();
    }

    validateLogin(username) {
        if (this.activeSessions.has(username)) {
            throw new Error('User already logged in from another device');
        }
    }

    trackLoginAttempt(username) {
        const attempts = this.loginAttempts.get(username) || 0;
        if (attempts >= 5) {
            setTimeout(() => this.resetLoginAttempts(username), 1800000); // Reset after 30 min
            throw new Error('Too many login attempts. Account temporarily locked.');
        }
        this.loginAttempts.set(username, attempts + 1);
    }

    resetLoginAttempts(username) {
        this.loginAttempts.delete(username);
    }

    enforceFullScreenMode(onViolation) {
        let violationCount = 0;
        const maxViolations = 2;

        const checkFullScreen = () => {
            if (!document.fullscreenElement) {
                violationCount++;
                if (violationCount > maxViolations) {
                    onViolation();
                } else {
                    alert("Stay in full-screen mode! Further violations will end the exam.");
                }
            }
        };

        document.addEventListener('fullscreenchange', checkFullScreen);
        return () => {
            document.removeEventListener('fullscreenchange', checkFullScreen);
        };
    }

    monitorTabVisibility(onTabSwitch) {
        let tabSwitchCount = 0;
        const maxAllowedSwitches = 3;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                tabSwitchCount++;
                if (tabSwitchCount > maxAllowedSwitches) {
                    onTabSwitch();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }
}

export { ExamSecurity };
