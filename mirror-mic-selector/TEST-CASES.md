# DEV-235 mic-selector mockup — every-branch test cases

Control state space (the four toggles):

| Control        | Values                     |
| -------------- | -------------------------- |
| Viewport       | Desktop · Mobile           |
| Mic permission | Granted · Not yet          |
| Mobile status  | Tested · Default · Blocked |
| Capture        | Idle · Live                |

Full cross-product = 2 × 2 × 3 × 2 = **24 control combinations**. Mobile-status
only matters in the Mobile viewport (Desktop always shows the device _name_, never
a status color, and hides the status control), so the 8 Desktop × status rows are
expected to be **identical** — the matrix asserts that inertness explicitly rather
than assuming it.

Each combination is observed at **two layers**:

- **IDLE** — before the picker is opened: what is selected, and what the top bar shows.
- **OPEN** — after clicking the mic pill: _which_ picker appears and the invariants that make it the right one.

## Invariants asserted on every branch

IDLE:

1. **Device width** = 760 px (Desktop) or 372 px (Mobile) — the _rendered_ width, not just the class.
2. **Status control** visible **iff** Mobile.
3. **Pill label** = `Set up microphone` when permission = Not yet, else the device name (`Tonor Mic`).
4. **Pill status color** = `default` (Not yet) · `tested` (Desktop, granted) · the selected Mobile status (Mobile, granted).
5. **Mic button glow** (`.live`) present **iff** Capture = Live.
6. No picker is open (menu, sheet, modal all hidden).

OPEN (click the pill):

7. **Picker type matches context:** Not yet → MicTestModal · Desktop+granted → dropdown menu · Mobile+granted → bottom sheet. The other two pickers stay hidden.
8. The open picker is **reachable** (top-most element at its own center — catches clipping/occlusion).
9. **Sheet only:** the phone **top bar stays visible** behind the sheet (the bug in the first screenshot: the sheet covered the whole frame), and the **scrim** is shown.
10. **Menu only:** stays within the device's horizontal bounds; top bar visible.

## The 24 combinations

`status` is `—` where the viewport is Desktop (control hidden, value inert).

| #   | Viewport | Permission | Status    | Capture | IDLE: pill label  | IDLE: pill color | OPEN: picker  |
| --- | -------- | ---------- | --------- | ------- | ----------------- | ---------------- | ------------- |
| 1   | Desktop  | Granted    | —         | Idle    | Tonor Mic         | tested           | dropdown menu |
| 2   | Desktop  | Granted    | —         | Live    | Tonor Mic         | tested           | dropdown menu |
| 3   | Desktop  | Not yet    | —         | Idle    | Set up microphone | default          | MicTestModal  |
| 4   | Desktop  | Not yet    | —         | Live    | Set up microphone | default          | MicTestModal  |
| 5   | Mobile   | Granted    | Tested    | Idle    | Tonor Mic (icon)  | tested           | bottom sheet  |
| 6   | Mobile   | Granted    | Tested    | Live    | Tonor Mic (icon)  | tested           | bottom sheet  |
| 7   | Mobile   | Granted    | Default   | Idle    | Tonor Mic (icon)  | default          | bottom sheet  |
| 8   | Mobile   | Granted    | Default   | Live    | Tonor Mic (icon)  | default          | bottom sheet  |
| 9   | Mobile   | Granted    | Blocked   | Idle    | Tonor Mic (icon)  | blocked          | bottom sheet  |
| 10  | Mobile   | Granted    | Blocked   | Live    | Tonor Mic (icon)  | blocked          | bottom sheet  |
| 11  | Mobile   | Not yet    | Tested    | Idle    | Set up microphone | default          | MicTestModal  |
| 12  | Mobile   | Not yet    | Tested    | Live    | Set up microphone | default          | MicTestModal  |
| 13  | Mobile   | Not yet    | Default   | Idle    | Set up microphone | default          | MicTestModal  |
| 14  | Mobile   | Not yet    | Default   | Live    | Set up microphone | default          | MicTestModal  |
| 15  | Mobile   | Not yet    | Blocked   | Idle    | Set up microphone | default          | MicTestModal  |
| 16  | Mobile   | Not yet    | Blocked   | Live    | Set up microphone | default          | MicTestModal  |
| 17  | Desktop  | Granted    | (Tested)  | Idle    | Tonor Mic         | tested           | dropdown menu |
| 18  | Desktop  | Granted    | (Default) | Idle    | Tonor Mic         | tested           | dropdown menu |
| 19  | Desktop  | Granted    | (Blocked) | Idle    | Tonor Mic         | tested           | dropdown menu |
| 20  | Desktop  | Granted    | (Blocked) | Live    | Tonor Mic         | tested           | dropdown menu |
| 21  | Desktop  | Not yet    | (Blocked) | Idle    | Set up microphone | default          | MicTestModal  |
| 22  | Desktop  | Not yet    | (Default) | Live    | Set up microphone | default          | MicTestModal  |
| 23  | Mobile   | Granted    | Default   | Live    | Tonor Mic (icon)  | default          | bottom sheet  |
| 24  | Mobile   | Granted    | Tested    | Idle    | Tonor Mic (icon)  | tested           | bottom sheet  |

Rows 17–24 deliberately repeat earlier control values to prove Desktop ignores the
status toggle (17–22) and to round out the Mobile status×capture grid (23–24);
the harness generates all 24 by cross-product so none is hand-skipped.

## Interaction branches (beyond the 24 idle/open states)

| Branch  | Action                                              | Expected                                                                  |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| I1      | Desktop menu → pick "MacBook Pro Microphone"        | pill label = that name; menu closes; that option `aria-selected`.         |
| I2      | Mobile sheet → pick "External USB Audio"            | sheet closes; that option marked selected.                                |
| I3      | Mobile, status=Blocked → pick a device              | status resets to **Tested** (re-pick = re-test); pill color → tested.     |
| I4      | Menu → "Test microphone…"                           | picker closes; MicTestModal opens.                                        |
| I5      | Sheet → "Test microphone…"                          | picker closes; MicTestModal opens.                                        |
| I6      | MicTestModal → "Start mic test" (modalGo)           | modal closes; permission → Granted; device → Tonor Mic; label updates.    |
| I7      | Toggle permission Not yet ↔ Granted (no pill click) | pill label flips live between "Set up microphone" and device name.        |
| I8 (D3) | Capture=Live (mobile) → sheet → pick a device       | sheet closes; capture stays Live (`.live` retained); dictation continues. |

## Known failure this matrix was written to catch

- **Sheet-covers-phone (first screenshot):** in Mobile the bottom sheet was taller
  than the phone body, so it occluded the entire frame — top bar gone, no scrim
  context — reading as a generic/desktop-style picker rather than a mobile bottom
  sheet. Invariant **9** (top bar reachable behind the open sheet) fails on the
  old build and passes after the fix (taller mobile phone + sheet capped to 70%).
