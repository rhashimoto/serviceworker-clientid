// This is a Worker script that invokes fetch once a minute.
(function repeat() {
  fetch('from-worker');
  setTimeout(repeat, 60_000);
})();