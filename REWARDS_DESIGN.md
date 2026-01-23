# Rewards Design (Social Primitive)

## 1) Earning Unit
**Chosen unit:** Reputation points (non-transferable, off-chain)

**Why:**
- Lightweight and easy to iterate without tokenomics.
- Fits the "daily proof" ethos and avoids speculative incentives.

## 2) Issuance Rules (Tied to Social Primitive)
**Primary primitive:** Daily proof cards + community validation.

**Rules:**
1. **Daily Submission:**
   - +10 reputation points for each daily proof card submitted (max 1/day).
2. **Streaks:**
   - +5 bonus points for each 7-day streak milestone (7, 14, 21, 28, etc.).
   - Streaks reset after 48 hours without a submission.
3. **Peer Validation Thresholds:**
   - +15 bonus points when a proof card receives **3 distinct validations**.
   - +30 bonus points when a proof card receives **10 distinct validations**.
4. **Group Achievements (Optional Future):**
   - +50 points for completing a group challenge where **80%+** of members submit a proof card within a defined window.

## 3) On-Chain vs Off-Chain & Transferability
- **Storage:** Off-chain in the app data layer (e.g. Vercel KV or equivalent app database / KV store).
  - **User reputation record key (KV):** `user:reputation:{walletAddress}`
  - **Value (JSON structure, per user):**
    - `points`: number — total reputation points.
    - `currentStreak`: number — current consecutive days of valid submissions.
    - `longestStreak`: number — longest historical streak.
    - `lastSubmissionAt`: ISO timestamp of the last valid daily proof submission.
    - `validationCounts`: object — map of validation milestones, e.g. `{ "3": number, "10": number }`.
    - `tier`: string — current reputation tier (e.g. `"Bronze" | "Silver" | "Gold" | "Diamond"`).
    - `updatedAt`: ISO timestamp of the last reputation update.
  - **Implementation note:** The KV / database entries for this schema must be created and updated by the backend when submissions and validations are processed.
- **Transferability:** Non-transferable (reputation is account-bound).
- **On-chain mirror (optional):**
  - Periodic checkpoints can be written on-chain as a hash commitment for auditability, but the reputation tally remains off-chain.

## 4) How Earned Status Changes the User Experience
**Visibility:**
- Reputation tiers (e.g., Bronze, Silver, Gold, Diamond) displayed on profile and feed cards.

**Unlocks:**
- Higher tiers unlock:
  - Featured slots in the global feed.
  - Advanced analytics (streak history, impact dashboards).
  - Custom card themes or badge frames.

**Group Entry:**
- Certain community circles require a minimum reputation tier or streak count.

**Privileges:**
- Increased daily proof character limit.
- Ability to create or host group challenges.
- Priority access to new features (beta flags).
