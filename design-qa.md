# HSK 1 design QA

- Source: `C:/Users/alex_/AppData/Local/Temp/hsk-level-reference.png`
- Browser capture: `C:/Users/alex_/AppData/Local/Temp/hsk-level-mobile.jpg`
- Topic detail: `C:/Users/alex_/AppData/Local/Temp/hsk-level-topic-detail.jpg`
- Reference detail: `C:/Users/alex_/AppData/Local/Temp/hsk-level-reference-detail.png`
- State: Topics selected, Me and you marked Up next. The browser data has one completed exercise in Numbers.
- Comparison: The 941 × 1672 px reference was viewed at about 50% scale. The browser used a 470 × 836 CSS-pixel viewport at DPR 1, with 455 CSS pixels of content width. Its screenshot is 455 × 809 px. Layout was also checked at 360 CSS pixels and at the default desktop size.
## Findings

- Full view: The landscape, three tabs, spacing and vertical order of topic cards match the reference. The mobile layout fits without horizontal scrolling at both tested widths.
- Topic detail: The card includes a numbered flower, divider, character preview, illustration, exercise count, chevron and segmented progress. The filled segment reflects the browser's saved Numbers progress.
- The app renders the full topic list. The reference provides distinct illustrations for the first seven topics, and later topics use a shared landscape. The calendar illustration fades out at its lower edge, where the reference ends.

## Comparison history

- Initial capture showed a visible rectangle around the figures and a more compact header and card stack. The illustrations now feather into each card. The revised header and card heights place the seventh card near the viewport's lower edge, as in the reference.
- The final detail capture shows the abacus and figures within their respective cards and no visible paper edge around the figures.

## Verification

- Switched between Topics, Lessons, and All characters. Opened Lesson 1 and the Numbers and Me and you topics. Returned to HSK 1 and checked that Up next follows the most recently opened unfinished topic. Verified that the character search returns 你 and 好 for 你好, and that Home opens the home page.
- The final browser tab reported zero warnings or errors. Production build and all 89 tests passed.

final result: passed

## HSK 1 topic 4 · Introductions

- Source: the 941 × 1672 px image attached to the request. Compared visually with the full-page browser capture from `/hsk/1/4`, recorded in the conversation. The 941 × 836 CSS-pixel viewport at DPR 1 rendered a 926 × 1663 px capture after excluding the desktop scrollbar. Both showed the initial 0/4 state.
- Full view and detail: the desktop capture shows seven character cards per row, all 14 vocabulary rows, four exercise cards, and both lesson links. Checked title and Chinese type, pinyin contrast, spacing and card proportions, panel colors, and vocabulary text. The page uses the app’s watercolor artwork and icons. The indicator is empty at 0/4 and reports stored grades.
- Iteration: tightened section spacing, softened the title weight, warmed the section markers, and made the bottom mountain wash visible. The revised capture shows the final layout. At 390 and 320 CSS px the cards reflowed to four and three columns respectively, with no horizontal overflow.
- Browser checks: Writing, meaning, pinyin, and words opened their routes. Previous, Next, and HSK 1 opened the expected pages. No browser console warnings or errors. Type check, lint, production build, and all 89 tests passed.

final result: passed

## HSK 1 quiz screens

- Source: attached 941 × 1672 reference. Compared with the live quiz at 470 × 836 CSS px. The final capture showed `客` and four shuffled answers. Existing watercolor artwork supplies the blossoms, hills, bamboo and pavilion.
- Mobile layout: checked 320 px for horizontal overflow and 470 px for card scale and alignment. Desktop layout: checked 1280 px with the question and answers centered in a 656 px column.
- Browser checks: meaning quiz next button and automatic advance, lesson navigation, pinyin audio button after an answer, word tile selection and undo. Fresh load showed no console warnings or errors.

final result: passed
