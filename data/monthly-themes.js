/**
 * Twelve monthly editions. Two Italian charm links each.
 * Card copy is the four Happy Card sections.
 * Prices are not stored here. Charm ids resolve in js/catalog.js.
 */
(function (root) {
  'use strict';

  root.MonthlyThemes = [
    {
      id: 'jan', month: 'January', edition: 1, title: 'Beautiful Beginnings',
      charmIds: ['begin-sun', 'begin-star'],
      motivation: 'Start before you feel ready.',
      encouragement: 'A new page does not need a perfect first line.',
      reminder: 'You are allowed to begin again.',
      charms: 'A sun and a star. Light you choose, and light that stays.',
    },
    {
      id: 'feb', month: 'February', edition: 2, title: 'Choose Yourself',
      charmIds: ['choose-heart', 'choose-bow'],
      motivation: 'Put your name at the top of the list.',
      encouragement: 'Choosing yourself can be a quiet kind of courage.',
      reminder: 'You can be kind and still come first.',
      charms: 'A heart and a bow. Love, and the care of offering it to yourself.',
    },
    {
      id: 'mar', month: 'March', edition: 3, title: 'Create Your Own Luck',
      charmIds: ['luck-clover', 'luck-horseshoe'],
      motivation: 'Luck favors the habit you repeat.',
      encouragement: 'Make the opening, then walk through it.',
      reminder: 'Fortune is also a decision.',
      charms: 'A clover and a horseshoe, for luck you practice.',
    },
    {
      id: 'apr', month: 'April', edition: 4, title: 'Bloom at Your Own Pace',
      charmIds: ['bloom-flower', 'bloom-butterfly'],
      motivation: 'Growth is not a race.',
      encouragement: 'A late bloom is still a bloom.',
      reminder: 'Your pace is a valid pace.',
      charms: 'A flower and a butterfly. Open when you are ready.',
    },
    {
      id: 'may', month: 'May', edition: 5, title: 'Know Your Worth',
      charmIds: ['worth-crown', 'worth-diamond'],
      motivation: 'Know the value you already hold.',
      encouragement: 'You do not have to shrink to be liked.',
      reminder: 'Worth is not a negotiation.',
      charms: 'A crown and a diamond. Small, and not for sale.',
    },
    {
      id: 'jun', month: 'June', edition: 6, title: 'Find Your Sunshine',
      charmIds: ['shine-sun', 'shine-smile'],
      motivation: 'Look for the light you can stand in.',
      encouragement: 'Joy can be small and still count.',
      reminder: 'Keep a little warmth with you.',
      charms: 'A sun and a quiet smile.',
    },
    {
      id: 'jul', month: 'July', edition: 7, title: 'Be Fearlessly You',
      charmIds: ['brave-bolt', 'brave-flame'],
      motivation: 'Take up your own space.',
      encouragement: 'Fear can ride along. It does not have to drive.',
      reminder: 'You are allowed to be fully yourself.',
      charms: 'A bolt and a flame.',
    },
    {
      id: 'aug', month: 'August', edition: 8, title: 'Enjoy the Little Things',
      charmIds: ['little-cherry', 'little-daisy'],
      motivation: 'Notice the ordinary good.',
      encouragement: 'A small pleasure is still a pleasure.',
      reminder: 'Happiness often arrives in pieces.',
      charms: 'A cherry and a daisy.',
    },
    {
      id: 'sep', month: 'September', edition: 9, title: 'Trust Your Journey',
      charmIds: ['journey-compass', 'journey-arrow'],
      motivation: 'Trust the direction, even on a slow mile.',
      encouragement: 'You do not need the whole map today.',
      reminder: 'Keep going. The path is yours.',
      charms: 'A compass and an arrow.',
    },
    {
      id: 'oct', month: 'October', edition: 10, title: 'Embrace Change',
      charmIds: ['change-moon', 'change-leaf'],
      motivation: 'Let the season turn.',
      encouragement: 'Change can be gentle and still be real.',
      reminder: 'You can release what no longer fits.',
      charms: 'A moon and a leaf.',
    },
    {
      id: 'nov', month: 'November', edition: 11, title: 'Practice Gratitude',
      charmIds: ['thanks-heart', 'thanks-sunflower'],
      motivation: 'Name one good thing.',
      encouragement: 'Gratitude is a practice, not a mood you wait for.',
      reminder: 'There is something to thank.',
      charms: 'A heart and a sunflower.',
    },
    {
      id: 'dec', month: 'December', edition: 12, title: 'Believe in Yourself',
      charmIds: ['believe-star', 'believe-wings'],
      motivation: 'Believe the future you are building.',
      encouragement: 'You have done hard things before.',
      reminder: 'Trust yourself with the next step.',
      charms: 'A shooting star and a pair of wings.',
    },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
