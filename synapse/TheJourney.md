# Evolution

The idea for Synapse is based on the creation of similar dashboards to show project status information that were built at previous jobs in previous lives.  Here at Buildit there have been several explorations (such as [MI Lite](https://bitbucket.org/digitalrigbitbucketteam/mi-lite)) at recreating a similar view.

That led to the decision to create a branded dashboard.  A POC using the static graphs from the Buildit pitch decks was created using Python with some JS and D3.  With the help of UX/UI Design focused colleagues the [MIDAS](https://bitbucket.org/digitalrigbitbucketteam/midas) (MI Dashboard) project was created.  This incorporated a variety of feedback and styles.  And provided the ability to navigate to various dashboard views using the [Portfolio, Program, Project paradigm](http://pmfiles.com/2011/570/).

Still MIDAS was a static view.  Thus an API was created ([REST API](https://bitbucket.org/digitalrigbitbucketteam/mi_rest_hack)) to serve "real" data to MIDAS so that we could get a better feel for its function.

The original vision for MIDAS incorporated more dashboard views that were being initially implemented.  Some features had to be hidden.  Navigation became complicated.  The ability to render the views necessary caused the team to try several charting technologies (HighChart and D3).  We began to make use for JS frameworks such as React/Redux.  Also during this time the team supporting development had undergone changes in personnel.

As a result, when attempting to add a [scrubber line](https://en.wikipedia.org/wiki/Scrubbing_%28audio%29) feature to the Project Status view, the team came to the conclusion that a refactoring was in order as the manipulation of the DOM across the visualizations had become untenable to the point that the feature could not be implemented.

After some debate and spikes the team chose to relaunch MIDAS using Buildit core atomic design principles and a living style guide.  The team chose to use the React/Redux JS framework and D3 for charting, all in an ES6 context.  We also took care to create a sustainable project using engineering principles important to the team by supporting CI/CD, static analysis (ESLint), unit tests (Mocha/Chai), and acceptance test (Selenium).

As a result of these decisions MIDAS has been rebranded as Synapse. Synapse (the brand) is the brainchild of Claire Moore and well, we (or at least I) just like the concept.  Makes me think of neurons firing and learning.
