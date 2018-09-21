Author: Joao Pereira
Department: Bioengineering
CID: 01381740

Parts of visualisation:

1:Rotational Equivalents of Linear Motion
In this simulation, I am comparing various linear quantities to their rotational analogues, in the hope of introducing
the concept of moments of inertia, and helping students visualise it. For this comparison, I have the rotating masses and linearly
travelling masses side by side, where each mass has the same kinetic energy. Through a button, the user can also
access either a table of rotational or translational quantities, or a qualitative bar chart without labels, simply showing which combination of inputs leads to a larger quantity than others, etc.
HTML-index.html
JS-guidance.js and sketch.js
CSS-style.css

2. Parallel Axis Theorem
In this simulation, I was able to fit in the theory on the left, which is brought up in the theory page for users looking for the theory.
Different shapes can be chosen and their parameters can be altered, as well as the axis of rotation can be dragged around, 
whilst the center of mass of the selected shape remains static. Through different combinations of inputs, the user can get 
a better understanding of the parallel axis theorem and the different components of the moment of inertia about an axis that does not pass through a rigid body's center of mass.
HTML-index2.html
JS-guidance.js and sketch2.js
CSS-style.css

3. Theory page
In this theory page, I introduce the concept of moments of inertia and show rotational equivalents to linear motion, something
the user is more likely to be familiar with. For theory on the parallel axis theorem they can go to the second page.
HTML-theory.html

Suggestions+Ideas:
- Adding a dragger that is contained within the boundaries of the shape, which would represent the elemental mass. WIth that elemental mass, all the distances involved in the parallel axis theorem can be displayed visually, then quantitatively through a table.
- Perhaps the shapes could also have been shown rotating at an axis perpendicular to the parallel axis as well
- A real-time rotational mode could also be addded, with play and pause buttons. If energy sliders are also added, the effect of moving the axis away and other user inputs can visually show how much the shape will slow down depending on what is changed.
