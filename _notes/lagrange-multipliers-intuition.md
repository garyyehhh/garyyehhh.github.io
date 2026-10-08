---
title: "Lagrange Multipliers"
date: 2026-06-10
updated: 2026-06-10
course: "Multivariable Calculus"
status: "Completed"
tags:
  - Calculus
  - Optimization
trail:
  - Mathematics
  - Multivariable Calculus
  - Constrained Optimization
summary: "My intuition for Lagrange multipliers through contours, constraints, and tangency."
thinking_excerpt: "A crossing means there is still room to improve. A tangent point means we ran out of improving directions along the allowed path."
math: true
---

<!-- Update 2.3: first-draft Lagrange multipliers note. -->

While learning the mathematics behind different machine learning concepts, I came across SVMs, and $L_1$ and $L_2$ regularization. At first, I understood them mainly as techniques for preventing overfitting. But I wanted to understand the mathematics beneath that explanation more deeply.

Since my formal mathematical background comes mostly from a few statistics and quantitative modules at university, I have been trying to build stronger intuition for the ideas that appear repeatedly in machine learning, especially multivariable calculus and optimization.

One concept I recently encountered was Lagrange multipliers. The method itself is easy enough to state: to optimize a function $f(x, y)$ subject to a constraint $g(x, y) = c$, we look for points where:

<div class="thesis-equation" markdown="1">

$$
\nabla f = \lambda \nabla g
$$

</div>

In words, the gradient of the objective function must be parallel to the gradient of the constraint.

But this condition did not immediately make sense to me. I could follow the algebra, but I did not really understand why setting two gradients parallel would give us an extremum (i.e. a maximum or a minimum). Why should parallel gradients tell us that we have found the best possible point under a constraint?

The idea started to click when I began thinking geometrically. I began to picture walking along a constraint, crossing contour lines, following gradients, and noticing what changes when movement is restricted.

This note is my attempt to cement that intuition. I want to explain Lagrange multipliers in the way they began to make sense to me: as a story about moving along a constraint and eventually reaching a point where there is no allowed direction left to improve.


## Contours as height levels

Suppose $f(x, y)$ gives the height of a mountain at location $(x, y)$.

A contour line is the set of points where the function has the same value, so we can set it equal to some constant $c$:

$$
f(x, y) = c
$$

If I walk along one contour line, my height does not change. If I move to a different contour line, I am moving to a different height.

So instead of seeing $f(x, y)$ only as a formula, I can imagine a map with many height levels drawn on it.

<figure class="concept-diagram">
  <svg viewBox="0 0 640 300" role="img" aria-label="Contour lines and a constraint path">
    <desc id="contour-desc">Several contour ellipses are crossed by one constraint curve.</desc>
    <path d="M118 78C194 34 331 42 417 91C503 140 493 221 393 248C294 276 154 241 105 179C70 135 75 103 118 78Z" />
    <path d="M171 103C230 75 324 80 380 115C438 151 431 204 365 223C297 244 196 218 161 173C137 142 141 121 171 103Z" />
    <path d="M224 129C262 112 326 114 360 138C395 162 389 194 347 207C305 220 245 204 220 176C202 156 204 140 224 129Z" />
    <path class="constraint-backdrop" d="M128 238C191 166 251 132 310 135C367 138 415 183 500 64" />
    <path class="constraint" d="M128 238C191 166 251 132 310 135C367 138 415 183 500 64" />
    <text class="constraint-label" x="494" y="77">g(x,y)=c</text>
    <text class="contour-label" x="92" y="73">f=c1</text>
    <text class="contour-label" x="162" y="104">f=c2</text>
    <text class="contour-label" x="237" y="135">f=c3</text>
  </svg>
  <figcaption>The contours are equal-value lines (i.e. a contour line connects all points where the function has the same output value). The constraint is the path I am allowed to stay on.</figcaption>
</figure>

## The constraint is the 'allowed path'

In ordinary optimization, I can move anywhere. If I want to increase $f$, I can follow the direction where $f$ increases fastest.

Once a constraint is added, I can no longer move anywhere on the map. I can only consider points that satisfy the constraint:

$$
\text{maximize or minimize } f(x, y) \text{ subject to } g(x, y) = c
$$

Simply put:

> Find the highest or lowest value of $f$, but only among points that satisfy the constraint.

I picture this as a boundary drawn on the map. That boundary is the 'allowed path':

$$
g(x, y) = c
$$

The mountain then gives a height to every point on the map:

$$
z = f(x, y)
$$

So the optimization problem becomes:

> Along this boundary, where does $f(x, y)$ reach its highest or lowest value?

This helped me separate the two roles. The function $f$ gives the height I care about. The constraint $g(x, y) = c$ tells me where I am allowed to stand.

## $g(x, y) = c$

So $g(x, y) = c$ means the point $(x, y)$ lies on a particular level curve of $g$. If I graph the surface $z = g(x, y)$, this level curve is the curve where that surface meets the horizontal plane $z = c$.

But in the optimization problem, I am not trying to optimize the height of $g$. I am using this level set to decide which $(x, y)$ locations are allowed. Then I evaluate $f(x, y)$ only along those allowed locations.

In many Lagrange multiplier problems, the constraint is rewritten in zero form. If the original constraint is:

$$
g(x, y) = c
$$

I can define a new constraint function:

$$
f(x, y) = g(x, y) - c
$$

Then the same allowed path is written as:

$$
f(x, y) = 0
$$

So the zero is not special by itself. It just means the rewritten constraint is satisfied. If I graph $z = f(x, y)$, then $f(x, y) = 0$ is the zero-height level curve of the $f$ surface. But the role of that zero-level curve is to mark the path where I am allowed to stand while optimizing $f$.

For example, if the allowed path is:

$$
y = 2x^2 - 9x + 1
$$

then I can move everything to one side:

$$
y - 2x^2 + 9x - 1 = 0
$$

and define:

$$
f(x, y) = y - 2x^2 + 9x - 1
$$

In other words, $f(x, y) = 0$ means the point $(x, y)$ lies on the allowed curve. If $f(x, y)$ is not zero, the point is off the path.

This visualization helped me a lot. The constraint is not another height function I am trying to optimize. It is the rule for where I am allowed to stand.

## Crossing paths

When the allowed path crosses a contour line of $f$, the point is on both things at once: it satisfies the constraint, and $f$ has that contour value.

But that alone does not make it a maximum or minimum.

At a normal crossing, the path passes through the contour instead of just touching it. So if I keep walking a little along the allowed path, I usually move to one side of that contour or the other. One side may give a higher value of $f$; the other may give a lower value.

So a crossing often means:

> Keep going. There may be higher values ahead (maximum), or lower values ahead (minimum).

<figure class="concept-diagram">
  <svg viewBox="0 0 640 300" role="img" aria-label="A crossing point is not necessarily optimal" aria-describedby="crossing-desc">
    <desc id="crossing-desc">A constraint path cuts through a contour line, showing that nearby allowed points can move toward better contours.</desc>
    <path d="M118 85C205 43 355 49 438 102C522 156 495 223 386 244C277 265 128 224 91 159C70 120 83 101 118 85Z" />
    <path d="M172 115C233 86 331 91 385 126C442 162 422 206 352 219C279 232 185 207 156 166C139 141 146 126 172 115Z" />
    <path class="constraint" d="M99 244C190 189 250 149 306 132C369 113 423 116 532 78" />
    <circle cx="305" cy="132" r="7" />
    <text class="constraint-label" x="420" y="70">g(x,y)=c</text>
    <text class="contour-label" x="146" y="109">f=k</text>
  </svg>
  <figcaption>At a normal crossing, the allowed path still passes through the contour, so nearby allowed points may be better.</figcaption>
</figure>

We keep walking along the path until we find the best possible contour and cannot cross into a better one.

## Tangent, gradient and normals

Along the allowed path, I may cross many contour lines. As I walk along the constraint, the value of $f$ can go up or down.

For a maximum, I can imagine sliding the contour lines upward. The answer is the highest contour that still touches the constraint.

For a minimum, I can imagine sliding the contour lines downward. The answer is the lowest contour that still touches the constraint.

At a smooth constrained optimum, the allowed path does not cut through the best reachable contour at the optimum point. It just touches it.

This does not mean I have reached the highest point in the entire contour plot. It means I have reached the best value of $f$ among the points I am allowed to stand on. At that best reachable contour, the crossing turns into tangency.

At that touching point, if I move a tiny bit along the allowed path, I do not immediately get a better value.

With this intuition:

> A crossing means there is still room to improve. A tangent point means we ran out of improving directions along the allowed path.

<figure class="concept-diagram">
  <svg viewBox="0 0 640 300" role="img" aria-label="Tangency marks a candidate optimum" aria-describedby="tangent-desc">
    <desc id="tangent-desc">A green constraint curve touches the best reachable contour at one point, while a dashed better contour sits beyond the path.</desc>
    <path d="M94 158C94 96 196 58 320 58C444 58 546 96 546 158C546 220 444 258 320 258C196 258 94 220 94 158Z" />
    <path class="glow-contour" d="M160 158C160 114 232 88 320 88C408 88 480 114 480 158C480 202 408 230 320 230C232 230 160 202 160 158Z" />
    <path style="stroke-dasharray: 7 9; opacity: 0.5;" d="M250 108C250 82 282 66 320 66C358 66 390 82 390 108C390 134 358 150 320 150C282 150 250 134 250 108Z" />
    <path class="constraint-backdrop" d="M112 272C190 234 256 230 320 230C384 230 450 234 528 272" />
    <path class="constraint" d="M112 272C190 234 256 230 320 230C384 230 450 234 528 272" />
    <circle cx="320" cy="230" r="7" />
    <text x="336" y="223">tangent point</text>
    <text class="contour-label glow-contour-label" x="174" y="116">f = k*</text>
    <text class="contour-label" x="404" y="92">f &gt; k*</text>
    <text class="constraint-label" x="426" y="263">g(x,y)=c</text>
  </svg>
  <figcaption>The path may cross lower contours elsewhere. At the optimum, the best reachable contour $f = k^*$ is the one it only touches; better contours may exist, but the constraint does not reach them.</figcaption>
</figure>

## Gradients

Why does the gradient point to the steepest direction?

Before understanding how gradients, tangents, and normals tie together, I want to make sure I understand the intuition of the gradient of $f(x,y)$.

The gradient collects the partial derivatives of a function. For a function $f(x, y)$, it is:

$$
\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)
$$

At first, this just looks like a vector of partial derivatives. Let's break down the idea.

If:

$$
f(x, y) = x
$$

then the height is:

$$
z = x
$$

Here, when we move in the positive $x$ direction, we increase the height. Moving in the $y$ direction does nothing, because the function does not depend on $y$.

So:

$$
\nabla f = (1, 0)
$$

That makes sense. Intuitively, the function only rises in the $x$ direction. So the direction $(1,0)$ is the steepest upward. Similarly, the steepest downward direction is $(-1, 0)$.

Now if we move in the $y$ direction, such as $(0,1)$ or $(0, -1)$, we can see that we have no impact on the height, because $z = x$ does not depend on $y$. 

Now if we bring two ideas together: I start moving in the $(1,0)$ direction with gradient $+1$, and then slowly turn myself anti-clockwise to the $(0,1)$ direction. The slope slowly decreases to $0$.

We continue turning $90^\circ$ anti-clockwise to the $(-1,0)$ direction, with the slope becoming more negative until it reaches $-1$. 

For a more general flat plane:

$$
f(x, y) = Ax + By + C
$$

the gradient is:

$$
\nabla f = (A, B)
$$

The $A$ tells me how much the plane rises when I move in the $x$ direction, keeping $y$ constant. The $B$ tells me how much it rises when I move in the $y$ direction, keeping $x$ constant. The $C$ only shifts the whole plane up or down, so it does not change the direction of steepest uphill.

To tie everything together, we should be able to follow that we can rotate functions by an arbitrary number of degrees. The gradient direction, or the steepest direction, will then rotate accordingly by that arbitrary number of degrees.

In our example with the $(1,0)$ gradient direction, let's paint a red line here. If we rotate the whole function $f(x,y)$ by $45^\circ$, the steepest direction, the red line, moves with the function by $45^\circ$. 

We now end with two main points: 1. the gradient of $f(x,y)$ always points to the steepest direction; 2. the steepest direction is orthogonal to the tangent direction.

### Formally, we can use dot product

Suppose I choose a unit walking direction $u$. The directional derivative tells me how much $f$ changes if I take a tiny step in that direction:

$$
D_u f = \nabla f \cdot u
$$

The dot product can be written as:

$$
\nabla f \cdot u = \|\nabla f\|\,\|u\|\cos\theta
$$

Because $u$ is a unit direction, $\|u\| = 1$, so:

$$
D_u f = \|\nabla f\|\cos\theta
$$

Now the only thing that changes is the angle $\theta$ between my walking direction and the gradient.

If $\theta = 0$, I am walking exactly with the gradient, and $\cos\theta$ is as large as possible. That gives the steepest uphill direction.

If $\theta = 180^\circ$, I am walking exactly against the gradient. That gives the steepest downhill direction.

If $\theta = 90^\circ$, the dot product is zero. That means I am moving sideways relative to the gradient, so there is no immediate change in $f$.

That is why, in ordinary unconstrained optimization, I can think:

> If I want to increase $f$ as quickly as possible, follow the gradient direction. If I want to decrease it as quickly as possible, follow the negative gradient direction.

### The gradient $\nabla f$ is normal to a level curve

A level curve is:

$$
f(x, y) = k
$$

Let $t$ be the tangent direction to the level curve at a specific point $(x, y)$. Since moving infinitesimally in this tangent direction stays on the same level curve, the value of $f$ does not change to first order. 

$$
D_t f = 0
$$

But the directional derivative is:

$$
D_t f = \nabla f \cdot t
$$

So:

$$
\nabla f \cdot t = 0
$$
Therefore, $\nabla f$ is perpendicular to the tangent direction at that point.

A dot product of zero means the two directions are perpendicular. Therefore, the gradient is normal to the level curve.

<figure class="concept-diagram">
  <svg viewBox="0 0 640 300" role="img" aria-label="The gradient is normal to a level curve" aria-describedby="level-normal-desc">
    <desc id="level-normal-desc">A blue level curve has a tangent arrow along the curve and a gradient arrow perpendicular to it.</desc>
    <path d="M120 154C120 94 209 58 320 58C431 58 520 94 520 154C520 214 431 250 320 250C209 250 120 214 120 154Z" />
    <path class="glow-contour" d="M174 154C174 116 239 92 320 92C401 92 466 116 466 154C466 192 401 216 320 216C239 216 174 192 174 154Z" />
    <circle cx="320" cy="92" r="5.5" />
    <line class="vector blue-vector" x1="320" y1="86" x2="320" y2="42" />
    <polyline class="vector-head blue-vector-head" points="312,52 320,42 328,52" />
    <line class="tangent-guide" x1="250" y1="92" x2="426" y2="92" />
    <line class="vector" x1="336" y1="92" x2="426" y2="92" />
    <polyline class="vector-head" points="416,84 426,92 416,100" />
    <text class="contour-label glow-contour-label" x="246" y="48">∇f</text>
    <text x="438" y="98">tangent t</text>
    <text class="contour-label glow-contour-label" x="206" y="138">f = k</text>
    <text x="220" y="268">∇f · t = 0</text>
  </svg>
  <figcaption>Walking along a level curve gives no immediate change in $f$, so the tangent direction has zero dot product with the gradient. That makes the gradient normal to the curve.</figcaption>
</figure>

### Why parallel gradients matter

The gradient of $f$ points in the direction where $f$ increases fastest.

It is also perpendicular to the contour line of $f$.

The gradient $\nabla g$ is perpendicular to the constraint curve $g(x, y) = 0$.

At the optimum, the contour and the constraint are tangent. If two curves are tangent, they share the same tangent direction. That means their perpendicular directions are parallel.

So:

$$
\nabla f \parallel \nabla g
$$

which we write as:

$$
\nabla f = \lambda \nabla g
$$

The $\lambda$ is there because the two vectors do not need to have the same length. They may even point in opposite directions. $\lambda$ is the scaling factor that says, "these two normals point along the same line."

<figure class="concept-diagram">
  <svg viewBox="0 0 640 300" role="img" aria-label="Parallel gradients at tangency" aria-describedby="gradient-desc">
    <desc id="gradient-desc">A contour and constraint touch at one point, with two normal arrows drawn along the same normal direction.</desc>
    <path d="M94 158C94 96 196 58 320 58C444 58 546 96 546 158C546 220 444 258 320 258C196 258 94 220 94 158Z" />
    <path class="glow-contour" d="M160 158C160 114 232 88 320 88C408 88 480 114 480 158C480 202 408 230 320 230C232 230 160 202 160 158Z" />
    <path class="constraint-backdrop" d="M112 272C190 234 256 230 320 230C384 230 450 234 528 272" />
    <path class="constraint" d="M112 272C190 234 256 230 320 230C384 230 450 234 528 272" />
    <line x1="320" y1="280" x2="320" y2="102" stroke="rgba(5, 5, 5, 0.1)" stroke-width="2" stroke-dasharray="5 8" />
    <line x1="320" y1="224" x2="320" y2="106" stroke="rgba(255, 254, 250, 0.96)" stroke-width="10" stroke-linecap="round" />
    <line x1="320" y1="224" x2="320" y2="106" stroke="#2b7652" stroke-width="4.5" stroke-linecap="round" />
    <polygon points="320,92 311,110 329,110" fill="#2b7652" />
    <line x1="320" y1="224" x2="320" y2="152" stroke="rgba(255, 254, 250, 0.96)" stroke-width="7.5" stroke-linecap="round" />
    <line x1="320" y1="224" x2="320" y2="152" stroke="#050505" stroke-width="3.8" stroke-linecap="round" />
    <polygon points="320,140 312,156 328,156" fill="#050505" />
    <circle cx="320" cy="230" r="5.5" />
    <text x="238" y="174">∇f</text>
    <text class="constraint-label" x="345" y="130">∇g</text>
    <text x="350" y="213">same normal line</text>
    <text class="contour-label glow-contour-label" x="174" y="116">f = k*</text>
    <text class="constraint-label" x="426" y="263">g(x,y)=c</text>
  </svg>
  <figcaption>The arrows share the same normal line. One is shorter so both directions remain visible, but geometrically this is the condition $\nabla f = \lambda \nabla g$.</figcaption>
</figure>

## Maximum and minimum use the same idea

The Lagrange multiplier condition gives candidate points. It does not automatically tell me which candidate is the maximum and which is the minimum.

For a maximum, I look for the highest reachable contour.

For a minimum, I look for the lowest reachable contour.

After solving for candidate points, I still need to plug them back into $f(x, y)$ and compare their values.

That is a small but important point. The equation finds places where an optimum could happen. The comparison tells me which one is actually highest or lowest.

## Sources

Shibuya, Naoki. (2020). Lagrange Multiplier Demystified. https://naokishibuya.github.io/blog/2020-10-04-lagrange-multiplier-demystified/

