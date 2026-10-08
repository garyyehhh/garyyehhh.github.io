---
title: "Gradient Descent, One Step at a Time"
date: 2026-07-23
updated: 2026-07-23
course: "Cornell CS4780"
status: "Draft"
published: false
math: true
tags:
  - machine learning
  - optimization
  - gradient descent
trail:
  - Machine Learning
  - Optimization
  - Gradient Descent
summary: "My working intuition for how derivatives, gradients, local approximations, and step sizes come together in gradient descent."
thinking_excerpt: "Why does stepping in the negative gradient direction reduce the loss, and what determines whether that step actually helps?"
---

## The update rule is simple. Why it works is not.

Gradient descent is often introduced with one line:

$$
\theta_{t+1} = \theta_t - \eta \nabla J(\theta_t)
$$

I can read the symbols: start at the current parameters, calculate the gradient of the loss, and move in the opposite direction by some step size $\eta$.

But that description leaves me with most of the questions I actually care about:

- Why is the gradient the steepest direction?
- Why do we use the negative gradient?
- Why does a small step usually lower the loss?
- What exactly is the learning rate controlling?
- Why can gradient descent oscillate, diverge, or get stuck?
- What changes when the loss surface has thousands or millions of dimensions?

This note is my attempt to rebuild the update rule from its mathematical pieces, until it feels less like a formula to memorize and more like a natural consequence of the geometry.

## Start with one dimension

Before thinking about a model with many parameters, I want to understand the simplest case:

$$
y = f(x)
$$

At a point $x$, the derivative $f'(x)$ tells me the local slope.

My current intuition is:

- If $f'(x) > 0$, moving to the right increases the function, so moving left should decrease it.
- If $f'(x) < 0$, moving to the right decreases the function.
- If $f'(x) = 0$, the graph is locally flat, although that alone does not tell me whether I found a minimum.

Placeholder to develop:

> A derivative is not the height of the function. It is local information about how the height changes when I move.

### The tangent-line approximation

Near the current point, a smooth function can be approximated by its tangent line:

$$
f(x + \Delta x) \approx f(x) + f'(x)\Delta x
$$

This may be the first real reason gradient descent works. If I choose $\Delta x$ with the opposite sign from $f'(x)$, then the product $f'(x)\Delta x$ is negative, so the approximation predicts a lower value of $f$.

Placeholder questions:

- How local does the step need to be for this approximation to remain useful?
- How does curvature determine whether the prediction is accurate?
- Why can a step that points downhill still overshoot?

## From a derivative to a gradient

A machine-learning loss usually depends on many parameters:

$$
J(\theta_1, \theta_2, \ldots, \theta_d)
$$

The gradient collects one partial derivative for every parameter:

$$
\nabla J(\theta)
=
\begin{pmatrix}
\frac{\partial J}{\partial \theta_1} \\
\frac{\partial J}{\partial \theta_2} \\
\vdots \\
\frac{\partial J}{\partial \theta_d}
\end{pmatrix}
$$

Each component answers a narrow question: if I change this parameter while temporarily holding the others fixed, how does the loss change?

Together, the components form a direction in parameter space.

Placeholder intuition to develop:

> The gradient turns many separate one-dimensional slope measurements into one vector that describes the local tilt of the whole loss surface.

## Why the gradient is the steepest direction

Suppose I choose a unit direction $u$ and take a tiny step in that direction. The directional derivative is:

$$
D_u J(\theta) = \nabla J(\theta) \cdot u
$$

Using the geometric form of the dot product:

$$
\nabla J(\theta) \cdot u
=
\lVert \nabla J(\theta) \rVert
\lVert u \rVert
\cos \phi
$$

Because $u$ is a unit vector, $\lVert u \rVert = 1$. The only part I can change is the angle $\phi$.

- The largest increase occurs when $\phi = 0$: I move with the gradient.
- No immediate change occurs when $\phi = 90^\circ$: I move perpendicular to the gradient.
- The largest decrease occurs when $\phi = 180^\circ$: I move against the gradient.

So the steepest local descent direction is:

$$
-\nabla J(\theta)
$$

This is the geometric heart of gradient descent.

Placeholder for a diagram:

- A contour plot of a loss surface
- The gradient normal to a contour
- Several candidate walking directions
- The negative gradient highlighted as the direction with the greatest immediate decrease

## From local geometry to the update rule

For a small parameter change $\Delta \theta$, the multivariable linear approximation is:

$$
J(\theta + \Delta \theta)
\approx
J(\theta) + \nabla J(\theta)^\top \Delta \theta
$$

Now choose:

$$
\Delta \theta = -\eta \nabla J(\theta)
$$

Substituting this into the approximation gives:

$$
J(\theta + \Delta \theta)
\approx
J(\theta) - \eta \lVert \nabla J(\theta) \rVert^2
$$

If $\eta > 0$ and the gradient is nonzero, the second term is negative. Locally, the update should reduce the loss.

That gives the familiar rule:

$$
\boxed{
\theta_{t+1} = \theta_t - \eta \nabla J(\theta_t)
}
$$

The caveat is important: this argument is local. The direction may be right while the step is too large.

## The learning rate controls how much I trust the slope

The learning rate $\eta$ converts a direction into an actual step.

My current intuition is:

> The gradient tells me where downhill is from where I am standing. The learning rate tells me how far I am willing to walk before measuring the slope again.

### If the learning rate is too small

Placeholder ideas:

- Progress is reliable but slow.
- Flat regions can take many iterations to cross.
- The optimization may appear stuck even though it is still moving.

### If the learning rate is too large

Placeholder ideas:

- The update can jump across the valley.
- Repeated overshooting can create oscillation.
- The loss can increase or diverge even though every gradient points locally downhill.

### A learning rate that changes over time

Placeholder ideas:

- Start with larger exploratory steps.
- Reduce the step size near a minimum.
- Learning-rate schedules
- Line search
- Why there is no single perfect learning rate for every direction and every stage of training

## A quadratic bowl as the cleanest example

I want to work through a loss where the geometry is completely visible:

$$
J(w) = \frac{1}{2}aw^2
$$

Its gradient is:

$$
J'(w) = aw
$$

The update becomes:

$$
w_{t+1} = (1 - \eta a)w_t
$$

This simple recurrence should make several things concrete:

- When does $w_t$ move toward zero?
- When does it alternate from one side to the other?
- When does it diverge?
- How does the curvature $a$ restrict the learning rate?

Placeholder result to derive carefully:

$$
0 < \eta < \frac{2}{a}
$$

## Curvature changes the journey

The gradient gives first-order information. Curvature describes how quickly that gradient changes.

In more than one dimension, a loss surface can be steep in one direction and shallow in another. The result can be a long, narrow valley where gradient descent repeatedly crosses the steep direction while making slow progress along the shallow direction.

Placeholder ideas:

- The Hessian as a matrix of second derivatives
- Eigenvectors as the principal curvature directions
- Eigenvalues as the amount of curvature in those directions
- Condition number and why elongated contours slow convergence
- Why feature scaling can make optimization easier

Placeholder for a diagram:

- Circular contours versus elongated contours
- Equal starting points
- A direct path in the well-conditioned bowl
- A zigzagging path in the poorly conditioned valley

## A zero gradient is only a stationary point

When $\nabla J(\theta) = 0$, gradient descent has no first-order direction to follow.

But a zero gradient can describe:

- A local minimum
- A local maximum
- A saddle point
- A flat plateau

So "the gradient is zero" and "I found the solution" are not the same statement.

Placeholder ideas:

- Second derivative test in one dimension
- Hessian eigenvalues in multiple dimensions
- Why saddle points become common in high-dimensional optimization
- Why numerical optimization often stops when the gradient is small rather than exactly zero

## Batch, stochastic, and mini-batch gradients

The mathematical direction is defined using the full objective, but machine learning often estimates that direction from data.

### Batch gradient descent

Uses the entire training set for every update. The direction is stable, but each step can be expensive.

### Stochastic gradient descent

Uses one example at a time. Each step is noisy, but cheap.

### Mini-batch gradient descent

Uses a small batch of examples. This gives a practical balance between computational efficiency and a reasonably stable gradient estimate.

Question to explore:

> Is the noise in stochastic gradients merely a compromise, or can it actually help optimization move through flat regions and around saddle points?

## What gradient descent does not promise

Gradient descent is a local procedure. Its next move depends on the slope where it currently stands.

It does not automatically promise:

- The global minimum for a non-convex loss
- Fast convergence
- A useful solution without a suitable learning rate
- Insensitivity to parameter scaling
- Escape from every saddle point or flat region

Convexity changes the story because every local minimum of a convex function is also global. I want to keep that distinction visible without turning this note into a full treatment of convex optimization.

## Extensions I may separate into another note

These methods still belong to the gradient-descent family, but they may deserve their own page once the basic geometry is solid:

- Momentum
- Nesterov acceleration
- AdaGrad
- RMSProp
- Adam
- Natural gradient
- Newton's method and second-order optimization

For this note, the main goal is simpler: understand the mathematical reason for the direction, the role of the step size, and the geometry that makes the path easy or difficult.

## Working summary

My current understanding is:

- A derivative measures local change in one dimension.
- A gradient collects local change across all parameter directions.
- The dot product shows that the gradient gives the greatest immediate increase.
- The negative gradient therefore gives the greatest immediate decrease.
- A local linear approximation explains why a sufficiently small step should reduce the loss.
- The learning rate determines how far I move before measuring again.
- Curvature determines how quickly the local picture changes and how difficult the route can become.

The update rule is short, but it compresses all of these ideas:

$$
\theta_{t+1} = \theta_t - \eta \nabla J(\theta_t)
$$

The part I want to understand next is not just how to run this rule, but how to look at a loss surface and predict what kind of path the rule will take.
