---
title: "Bias, Variance, and Ensembles"
date: 2026-06-18
updated: 2026-06-18
course: "Cornell CS4780"
status: "Draft"
published: false
math: true
tags:
  - machine learning
  - bias variance
  - ensembles
trail:
  - Machine Learning
  - Generalization
  - Ensembles
summary: "My working intuition for the bias-variance tradeoff, the role of noise, and why kernels, bagging, and boosting push models in different directions."
thinking_excerpt: "When a model performs badly, is it wrong because it is too simple, too unstable, or because the data itself is noisy?"
---

## Why this topic matters

This is a first draft for the second part of my CS4780 study notes. I want this page to be less like a polished textbook explanation and more like a record of how I am trying to make sense of generalization.

The main question I want to keep returning to is:

> When a learning algorithm makes mistakes, where are those mistakes coming from?

At first, it is tempting to say "the model is bad." But that is too vague. A model can be bad because it is too rigid, because it changes too much when the training data changes, or because the data contains randomness that no model can fully remove.

This is where bias, variance, and noise give me a cleaner language.

## The rough picture

Before writing the math carefully, my current intuition is:

- Bias is error from being systematically wrong.
- Variance is error from being too sensitive to the particular training sample.
- Noise is error from randomness in the world or labels that the model cannot predict away.

So the learning problem is not just "fit the data better." It is more like:

> Fit enough structure to capture the signal, but not so much that I start memorizing accidents of the sample.

This note is my attempt to understand how different methods move that balance.

## The mathematical decomposition

Placeholder for the formal setup.

I want to derive or at least explain the usual decomposition:

$$
\mathbb{E}\left[(\hat{f}(x) - y)^2\right]
=
\text{bias}^2
+
\text{variance}
+
\text{noise}
$$

Questions I want this section to answer:

- What expectation are we taking?
- What is random: the training set, the test point, or the label noise?
- Why does squared error make this decomposition clean?
- Why does the cross term disappear?
- What does "irreducible error" actually mean?

Draft intuition to develop:

If I trained the same learning algorithm on many different datasets from the same population, I would get many slightly different fitted models. Bias asks whether their average prediction is centered around the truth. Variance asks how spread out those predictions are. Noise asks how much randomness remains even if I knew the true pattern.

## High bias: the model cannot bend enough

High bias happens when the hypothesis class is too limited for the pattern I am trying to learn.

I picture this as trying to fit a curved relationship with a line. No matter how much data I collect, the line still cannot represent the shape. More data helps me estimate the best line more confidently, but it does not solve the fact that the best line is still the wrong shape.

Placeholder ideas:

- Underfitting
- Too-simple hypothesis class
- Training error and test error both high
- More flexible features or models can reduce bias

## Kernels as one way to reduce bias

Kernels feel like a way to let a simple-looking algorithm behave as if it is working in a richer feature space.

Instead of manually choosing features, a kernel lets the model compare points using a similarity function that may correspond to a much higher-dimensional representation.

Placeholder ideas to fill in:

- Why linear models can have high bias in the original input space
- How feature maps can make nonlinear structure look linear
- Kernel trick intuition
- Polynomial kernels
- RBF / Gaussian kernels
- Why this can reduce bias
- Why too much flexibility can increase variance

Open question for later:

> Is the best way to explain kernels here through geometry, similarity, or feature expansion?

## High variance: the model bends too much

High variance happens when the fitted model depends too strongly on the particular sample I happened to train on.

I picture this as a model that is very expressive, but also nervous. If I remove a few points, add a few points, or resample the dataset, the learned function changes a lot.

Placeholder ideas:

- Overfitting
- Low training error but high test error
- Sensitivity to training data
- Complex decision boundaries
- Small datasets making variance worse

## Bagging: reduce variance by averaging instability

Bagging means bootstrap aggregating.

The idea I want to understand:

> If one unstable model jumps around too much, train many unstable models on slightly different bootstrap samples and average their predictions.

For regression, averaging predictions can smooth out the noise from any one fitted model. For classification, voting can reduce the chance that one unstable model dominates the final decision.

Placeholder ideas to fill in:

- Bootstrap sampling
- Why decision trees are good candidates for bagging
- Averaging independent or weakly correlated errors
- Random forests as bagging plus feature randomness
- Why bagging mainly targets variance rather than bias

Question to answer later:

> If the base model is biased, does averaging many biased models help?

My current guess: not much. Averaging reduces wobble, but it does not automatically fix a systematically wrong shape.

## Boosting: reduce bias by learning from mistakes

Boosting feels different from bagging.

Bagging trains models in parallel and averages them. Boosting trains models sequentially, where each new learner pays attention to what the previous learners got wrong.

The intuition I want to develop:

> A weak learner may be too simple on its own, but a sequence of weak learners can build a stronger model by correcting errors step by step.

Placeholder ideas to fill in:

- Weak learners
- Sequential correction
- Reweighting examples or fitting residuals
- AdaBoost intuition
- Gradient boosting intuition
- Why boosting is often described as reducing bias
- Why boosting can still overfit if pushed too far

Question to answer later:

> Is boosting best understood as reducing bias, doing functional gradient descent, or building an additive model?

Probably all three, but I need to decide which explanation belongs in this note.

## Where decision trees fit

Decision trees seem relevant because they are often the base learner for both bagging and boosting.

Placeholder ideas:

- A deep tree can have low bias but high variance.
- A shallow tree can have higher bias but lower variance.
- Random forests use many trees to reduce variance.
- Boosted trees use many weak trees to build a stronger predictor.

This section may become its own note if the tree intuition grows too large.

## Are Gaussian processes and k-dimensional trees relevant here?

I am not sure yet.

Current guess:

- Gaussian processes are relevant to model flexibility, uncertainty, kernels, and Bayesian prediction. They may connect nicely to kernels, but they might be too much for this note.
- k-dimensional trees seem more like a data structure for nearest-neighbor search than a central bias-variance method. They may belong in a different note unless CS4780 uses them to discuss nonparametric methods.
- Decision trees are definitely relevant because of bagging, random forests, and boosting.

For now, I will keep Gaussian processes and k-dimensional trees as possible side notes rather than core sections.

## Working summary

The bias-variance tradeoff gives me a way to diagnose model error:

- If the model is too simple, I need more flexibility.
- If the model is too unstable, I need regularization, averaging, or more data.
- If the noise is irreducible, I should stop expecting perfect prediction.

Kernels can help when the model has high bias because the representation is too simple.

Bagging can help when the model has high variance because each individual learner is unstable.

Boosting can help when weak learners have high bias because each learner corrects part of the remaining error.

The part I still want to understand deeply is how these stories connect mathematically to the bias-variance decomposition, rather than just as separate techniques.
