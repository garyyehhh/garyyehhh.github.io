---
title: "From Probabilities to Decisions"
date: 2026-07-29
updated: 2026-07-29
course: "Cornell CS4780"
status: "Draft"
published: false
math: true
tags:
  - machine learning
  - probability
  - classification
trail:
  - Machine Learning
  - Probability
  - Classification
summary: "A draft collection of probability foundations, decision rules, and classification ideas that extend beyond the focused MLE/MAP note."
thinking_excerpt: "The probability model, the parameter estimate, and the final decision are related, but they are not the same step."
---

## From observations to a fitted model

Before studying gradient descent more deeply, I realized that I was missing an earlier question.

Gradient descent tells me how to search for parameters. But where does the objective being optimized come from? Why does logistic regression use cross-entropy, and what does minimizing that loss have to do with probability?

The chain I want to understand is:

> data $\longrightarrow$ likelihood $\longrightarrow$ parameter estimate $\longrightarrow$ class probability $\longrightarrow$ decision

This note is my attempt to build that chain through maximum likelihood estimation, maximum a posteriori estimation, the Bayes decision rule, Naive Bayes, and logistic regression.

## The notation I will use

Suppose I observe a labelled dataset:

$$
\mathcal D = \{(x_i,y_i)\}_{i=1}^{n}
$$

where:

- $x_i$ is an input or feature vector.
- $y_i$ is its observed class.
- $\theta$ contains the unknown parameters of my model.
- $\mathcal D$ is fixed after I have observed it.

When I write

$$
p(\mathcal D\mid\theta),
$$

I am asking how compatible the observed data is with a particular choice of parameters.

### The i.i.d. assumption

Many standard derivations assume the observations are independent and identically distributed, or i.i.d., given $\theta$. Under that assumption:

$$
p(\mathcal D\mid\theta)
=
\prod_{i=1}^{n}p(x_i,y_i\mid\theta)
$$

For a conditional model such as logistic regression, I usually condition on the inputs and write:

$$
p(y_1,\ldots,y_n\mid x_1,\ldots,x_n,\theta)
=
\prod_{i=1}^{n}p(y_i\mid x_i,\theta)
$$

Placeholder questions:

- What does independence mean here, and when is it unrealistic?
- What changes when observations are related across time or space?
- For continuous variables, when should I say probability density rather than probability?

## Three questions that are easy to mix up

I find it useful to separate three layers:

| Layer | Question | Example |
| --- | --- | --- |
| Model | What probability distribution am I assuming? | Logistic regression |
| Estimation objective | What makes one parameter value better than another? | Maximum likelihood |
| Optimizer | How do I find that parameter value? | Gradient descent |

These layers work together, but they are not interchangeable.

> MLE and MAP define the parameter estimate I want. Gradient descent is one possible procedure for finding it.

## From MAP to regularization

The same idea appears in machine-learning objectives. Taking the logarithm of the MAP expression gives:

$$
\hat\theta_{\mathrm{MAP}}
=
\arg\min_{\theta}
\left[
-\log P(D\mid\theta)
-
\log P(\theta)
\right]
$$

The negative log-prior behaves like a regularization penalty.

For example:

- A zero-mean Gaussian prior on weights produces an L2 penalty.
- A zero-centered Laplace prior produces an L1 penalty.
- The prior scale controls the strength of the penalty.

This gives me a more meaningful interpretation of regularization:

> Regularization is not only a numerical trick. Under a probabilistic interpretation, it expresses which parameter values I consider plausible before seeing the data.

## A short boundary: MAP is not full Bayesian inference

MLE and MAP both return a single parameter value:

$$
\hat\theta_{\mathrm{MLE}}
\qquad\text{or}\qquad
\hat\theta_{\mathrm{MAP}}
$$

Full Bayesian inference retains the whole posterior distribution $P(\theta\mid D)$. A Bayesian predictive distribution can average predictions over parameter uncertainty:

$$
P(y\mid x,D)
=
\int
P(y\mid x,\theta)P(\theta\mid D)\,d\theta
$$

I do not plan to derive that integral here. I only want to keep the distinction visible:

> MAP uses the posterior to choose one parameter. Full Bayesian inference keeps the posterior as an object of interest.

## Probabilities are not yet decisions

A model may give me posterior class probabilities such as:

$$
p(y=1\mid x)=0.72
$$

I still need a rule that turns those probabilities into an action.

If every type of classification error has the same cost, I choose the class with the largest posterior probability:

$$
\hat y
=
\arg\max_y p(y\mid x)
$$

But equal costs are an assumption. If missing a disease is much more costly than a false alarm, the best decision threshold may be very different from $0.5$.

The more general Bayes decision rule minimizes posterior expected loss:

$$
\hat a(x)
=
\arg\min_a
\sum_y
\ell(a,y)p(y\mid x)
$$

Placeholder to develop:

- Compare equal-cost classification with asymmetric false-positive and false-negative costs.
- Explain why a probability model and a decision policy should remain separate.

## The Bayes decision rule

Bayes' rule lets me rewrite the posterior class probability:

$$
p(y\mid x)
=
\frac{p(x\mid y)p(y)}{p(x)}
$$

For class comparison, $p(x)$ is the same for every candidate class. Therefore:

$$
\hat y
=
\arg\max_y
p(x\mid y)p(y)
$$

The pieces have different roles:

- $p(y)$ is the class prior.
- $p(x\mid y)$ is the class-conditional likelihood.
- $p(y\mid x)$ is the class posterior.
- The decision rule chooses an action from the posterior.

The Bayes classifier is therefore a decision rule. It does not itself tell me how the probability distributions were learned.

Placeholder for a diagram:

$$
p(y)
+
p(x\mid y)
\longrightarrow
p(y\mid x)
\longrightarrow
\text{decision}
$$

## Naive Bayes models how features arise within each class

Naive Bayes is a generative classifier. It models the class prior $p(y)$ and the class-conditional feature distribution $p(x\mid y)$.

Its simplifying assumption is that features are conditionally independent once the class is known:

$$
p(x\mid y)
=
\prod_{j=1}^{d}p(x_j\mid y)
$$

The classification rule becomes:

$$
\hat y
=
\arg\max_y
p(y)
\prod_{j=1}^{d}p(x_j\mid y)
$$

For numerical stability, I would normally calculate this in log space:

$$
\hat y
=
\arg\max_y
\left[
\log p(y)
+
\sum_{j=1}^{d}\log p(x_j\mid y)
\right]
$$

### What the naive assumption actually says

Naive Bayes does not claim the features are independent everywhere. It assumes they are independent after conditioning on the class:

$$
x_j \perp x_k \mid y
$$

Placeholder example:

- Words such as “free” and “prize” may be related overall.
- Naive Bayes assumes their remaining dependence can be ignored once I know whether the email is spam.
- Ask why classification can still work when this assumption is visibly imperfect.

### Estimating the probabilities

Class priors and conditional feature probabilities can often be estimated from counts using MLE.

For categorical features, an unseen feature value can make the estimated probability zero. Because Naive Bayes multiplies feature probabilities, one zero can erase the entire class score.

A smoothed posterior-predictive estimate is:

$$
p(x_j=v\mid y=c,\mathcal D)
=
\frac{N_{jvc}+\alpha}{N_c+\alpha K}
$$

where $K$ is the number of possible feature values.

When $\alpha=1$, this is add-one or Laplace smoothing. Under a uniform Dirichlet prior, it is naturally interpreted as a posterior mean or posterior-predictive estimate. It should not automatically be labelled as the MAP estimate, whose formula contains prior parameters minus one.

Placeholder comparison:

- Unsmoothed MLE
- Add-one smoothing
- General Dirichlet smoothing
- What happens as the amount of data increases?

## Logistic regression models the posterior directly

Logistic regression takes a discriminative route. Instead of modelling $p(x\mid y)$ and $p(y)$ separately, it models $p(y\mid x)$ directly.

For binary classification:

$$
p(y=1\mid x,w,b)
=
\sigma(w^\top x+b)
$$

where:

$$
\sigma(z)
=
\frac{1}{1+e^{-z}}
$$

The sigmoid maps any real-valued score into the interval $(0,1)$.

### Odds and log-odds

If $p=p(y=1\mid x)$, the odds are:

$$
\frac{p}{1-p}
$$

Logistic regression assumes the log-odds are linear in the features:

$$
\log\frac{p}{1-p}
=
w^\top x+b
$$

Placeholder questions:

- Why is a linear model for log-odds more flexible than a linear model for probability?
- How does the hyperplane $w^\top x+b=0$ become the $0.5$ decision boundary?
- How do the magnitude and sign of a coefficient affect the odds?

## MLE produces binary cross-entropy

For $y_i\in\{0,1\}$ and predicted probability $p_i$, the conditional likelihood of one label is:

$$
p(y_i\mid x_i,w,b)
=
p_i^{y_i}(1-p_i)^{1-y_i}
$$

Under conditional independence, the full likelihood is:

$$
p(y_1,\ldots,y_n\mid X,w,b)
=
\prod_{i=1}^{n}
p_i^{y_i}(1-p_i)^{1-y_i}
$$

Taking the negative logarithm gives:

$$
\mathcal L(w,b)
=
-\sum_{i=1}^{n}
\left[
y_i\log p_i
+
(1-y_i)\log(1-p_i)
\right]
$$

This is binary cross-entropy.

So cross-entropy is not an arbitrary penalty attached to logistic regression:

> It is the negative log-likelihood of the Bernoulli model used for the labels.

Placeholder derivation:

1. Write the Bernoulli probability for one label.
2. Multiply across independent observations.
3. Take the logarithm.
4. Negate the result to turn maximization into minimization.

## The cross-entropy gradient leads to gradient descent

Logistic regression usually has no closed-form MLE for its parameters, so I need an iterative optimizer.

Let:

$$
p=\sigma(Xw+b)
$$

For binary cross-entropy, the gradients simplify to:

$$
\nabla_w\mathcal L
=
X^\top(p-y)
$$

and:

$$
\frac{\partial\mathcal L}{\partial b}
=
\sum_{i=1}^{n}(p_i-y_i)
$$

Placeholder derivation to complete carefully:

1. Differentiate binary cross-entropy with respect to $p_i$.
2. Differentiate the sigmoid with respect to its input.
3. Use the chain rule.
4. Observe the cancellation that leaves $p_i-y_i$.
5. Collect the individual derivatives into matrix form.

Gradient descent then performs:

$$
w_{t+1}
=
w_t-\eta X^\top(p-y)
$$

This is the handoff between the two notes:

> The probability model gives me the likelihood. MLE turns it into the cross-entropy objective. Differentiation gives me its gradient. Gradient descent uses that gradient to estimate the parameters.

### Perfect separation is an important edge case

If a linear boundary perfectly separates the classes, unregularized logistic-regression likelihood can keep improving as the coefficient magnitudes grow. A finite MLE may not exist.

A prior or regularization penalty can keep the parameters finite. This is a useful example of MAP changing more than just the numerical path to the same answer.

Placeholder to explore:

- Show a perfectly separable two-dimensional dataset.
- Increase the norm of $w$ without changing the decision boundary.
- Observe how predicted probabilities approach zero and one.
- Compare the unregularized and L2-regularized objectives.

## Generative and discriminative routes

Naive Bayes and logistic regression can both classify an input, but they model different quantities.

| Method | What it models | Typical estimation | Iterative optimization? |
| --- | --- | --- | --- |
| Naive Bayes | $p(x\mid y)$ and $p(y)$ | MLE or Bayesian smoothing | Usually no |
| Logistic regression | $p(y\mid x)$ directly | MLE or MAP | Usually yes |
| Bayes decision rule | Converts posterior probabilities into actions | Not a parameter estimator | No |

Questions I want to explore:

- Why can Naive Bayes work well with relatively little data?
- Why can logistic regression outperform it when enough data is available?
- Which assumptions does each model make about the data?
- When do their decision boundaries have similar forms?
- Does a classifier need well-calibrated probabilities to make accurate decisions?

## Two examples to carry through the note

Trying to force one example to explain everything may make the page harder to follow. I plan to use two connected examples.

### Example 1: estimating a coin bias

Use a Bernoulli process to explain:

- Likelihood
- Log-likelihood
- MLE
- A Beta prior
- MAP
- The posterior mean
- Why priors matter more when data is scarce

### Example 2: classifying an email

Use a tiny binary-feature dataset to explain:

- Class priors
- Class-conditional likelihoods
- The Bayes decision rule
- The conditional-independence assumption
- Zero counts and smoothing
- Logistic-regression probabilities
- Cross-entropy
- A gradient-descent update

Placeholder deliverable:

> Build one small table of emails and manually calculate one Naive Bayes prediction and one logistic-regression loss term.

## What I am leaving outside this first draft

These ideas are related, but including them now would make the main path harder to see:

- Full posterior computation
- Bayesian logistic regression
- Conjugate-prior derivations beyond the Bernoulli example
- Multiclass softmax regression
- Probability calibration
- Gaussian discriminant analysis
- Detailed decision theory

They can become follow-up notes once the main sequence is solid.

## Working summary

My current mental model is:

- A probability model describes how observations could be generated.
- Likelihood holds the observed data fixed and compares parameter values.
- MLE chooses parameters that maximize the likelihood.
- Negative log-likelihood turns probability estimation into a minimization objective.
- MAP combines the likelihood with a prior and returns one posterior mode.
- A posterior probability still needs a decision rule before it becomes a prediction or action.
- The Bayes decision rule chooses the action with the smallest posterior expected loss.
- Naive Bayes models $p(x\mid y)$ and $p(y)$ before applying Bayes' rule.
- Logistic regression models $p(y\mid x)$ directly.
- Binary cross-entropy is the negative log-likelihood of logistic regression.
- Gradient descent is an optimizer for that objective, not the principle that defined the objective.

The sentence I want to keep returning to is:

> The model tells me what probabilities mean, estimation tells me which parameters I want, and optimization tells me how to find them.
