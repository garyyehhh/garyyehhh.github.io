---
title: "Maximum Likelihood and MAP"
date: 2026-07-30
updated: 2026-08-04
course: "Cornell CS4780"
status: "Completed"
math: true
tags:
  - machine learning
  - probability
  - estimation
trail:
  - Machine Learning
  - Probability
  - Parameter Estimation
summary: "A focused working note on how likelihood, MLE, MAP, and priors turn observed data into parameter estimates."
thinking_excerpt: "MLE and MAP define the estimate I want; optimization is how I find it."
---
When I first encountered MLE and MAP, I understood them mainly as probability formulas. I did not yet see why they mattered for machine learning, or how they connected to the models and techniques I was already learning.

As I worked through Cornell CS4780, I began to notice that these ideas sit underneath many familiar methods. The loss functions used in linear regression, logistic regression, and neural networks can often be understood through likelihood assumptions. MAP also provides a probabilistic interpretation of regularization, including L1 and L2 penalties used to control overfitting.

That made MLE and MAP feel less like isolated statistical concepts and more like foundations connecting probability, optimization, loss functions, and generalization. I decided to spend time working through them carefully, so I could understand not only how the formulas are derived, but also why they keep reappearing throughout machine learning.


## Probability and likelihood use the same expression differently

I want to start with a small example rather than a definition.

Suppose I have a coin with an unknown probability $\theta$ of landing heads. I toss it several times and record the data:

<div class="study-setup" aria-label="Coin toss setup">
  <div class="study-setup-line">
    <span class="study-setup-label">Data:</span>
    <span>H, T, T, H, H, H, T, ...</span>
  </div>
  <div class="study-setup-line">
    <span class="study-setup-label">Parameter:</span>
    <span>$\theta$ = P(H)</span>
  </div>
</div>

If I fix $\theta$ and imagine different possible sequences of tosses, I am using the model as a probability distribution.

But if I fix the sequence I actually observed and compare different values of $\theta$, I am looking at a likelihood:

$$
L(\theta;D)=P(D;\theta)
$$

In other words:

> Probability asks what data I might see under a fixed parameter. Likelihood asks which parameter would make the data I just see most plausible.

The expression looks similar in both cases, but I am changing which quantity I treat as unknown. In the MLE derivation below, I will use a semicolon to make that viewpoint explicit: $P(D;\theta)$ means the likelihood as a function of $\theta$ with $D$ fixed.

<figure class="probability-likelihood-note">
  <div class="probability-likelihood-panels">
    <svg class="probability-likelihood-sketch probability-sketch" viewBox="0 25 520 305" role="img" aria-label="A probability sketch with theta fixed at 0.7 and several possible counts of heads">
      <desc>When theta is fixed at 0.7, a distribution over possible head counts appears. Seven heads is highlighted as one possible result.</desc>
      <text x="34" y="72" class="sketch-equation sketch-blue">&#952; = 0.7</text>
      <text x="34" y="134" class="sketch-question">What outcomes might it produce?</text>

      <path d="M 48 292 H 456" class="sketch-baseline" />
      <rect x="52" y="288" width="22" height="4" class="sketch-bar" />
      <rect x="88" y="282" width="22" height="10" class="sketch-bar" />
      <rect x="124" y="268" width="22" height="24" class="sketch-bar" />
      <rect x="160" y="244" width="22" height="48" class="sketch-bar" />
      <rect x="196" y="199" width="22" height="93" class="sketch-bar" />
      <rect x="232" y="149" width="22" height="143" class="sketch-bar" />
      <rect x="268" y="103" width="22" height="189" class="sketch-bar" />
      <g class="sketch-observation" role="img" aria-label="Seven heads is one possible result">
        <rect x="304" y="78" width="22" height="214" class="sketch-bar sketch-bar-active" />
        <line x1="315" y1="69" x2="315" y2="292" class="sketch-guide sketch-blue-stroke" />
        <circle cx="315" cy="69" r="4" class="sketch-blue-dot" />
        <text x="329" y="61" class="sketch-annotation sketch-blue">7 heads</text>
      </g>
      <rect x="340" y="113" width="22" height="179" class="sketch-bar" />
      <rect x="376" y="202" width="22" height="90" class="sketch-bar" />
      <rect x="412" y="252" width="22" height="40" class="sketch-bar" />

      <text x="52" y="315" class="sketch-tick">0</text>
      <text x="304" y="315" class="sketch-tick sketch-blue">7</text>
      <text x="425" y="315" class="sketch-tick">10</text>
    </svg>

    <div class="probability-likelihood-turn" aria-hidden="true">
      <strong>P(D&#59;&#952;)</strong>
    </div>

    <svg class="probability-likelihood-sketch likelihood-sketch" viewBox="0 25 520 305" role="img" aria-label="A likelihood sketch with seven heads and three tails fixed while theta varies">
      <desc>For the observed dataset of seven heads and three tails, the likelihood curve over theta peaks at 0.7.</desc>
      <text x="34" y="72" class="sketch-equation sketch-green">D = 7H, 3T</text>
      <text x="34" y="134" class="sketch-question">Which &#952; makes it most plausible?</text>

      <g class="sketch-data-row" aria-label="Seven heads and three tails">
        <text x="47" y="174" class="sketch-token sketch-blue">H</text>
        <text x="77" y="174" class="sketch-token sketch-blue">H</text>
        <text x="107" y="174" class="sketch-token sketch-blue">H</text>
        <text x="137" y="174" class="sketch-token sketch-blue">H</text>
        <text x="167" y="174" class="sketch-token sketch-blue">H</text>
        <text x="197" y="174" class="sketch-token sketch-blue">H</text>
        <text x="227" y="174" class="sketch-token sketch-blue">H</text>
        <text x="257" y="174" class="sketch-token sketch-green">T</text>
        <text x="287" y="174" class="sketch-token sketch-green">T</text>
        <text x="317" y="174" class="sketch-token sketch-green">T</text>
        <path d="M 44 184 H 332" class="sketch-data-underline" />
      </g>

      <path d="M 46 292 H 456" class="sketch-baseline" />
      <path d="M 48 289 C 128 289 189 283 240 254 C 284 228 315 181 342 192 C 376 205 404 264 451 289" class="sketch-likelihood-curve" />
      <g class="sketch-mle" role="img" aria-label="The maximum likelihood estimate is theta equals 0.7">
        <line x1="342" y1="192" x2="342" y2="292" class="sketch-guide sketch-green-stroke" />
        <circle cx="342" cy="192" r="5" class="sketch-green-dot" />
        <text x="356" y="193" class="sketch-annotation sketch-green">&#952;&#770; = 0.7</text>
      </g>
      <text x="46" y="315" class="sketch-tick">0</text>
      <text x="332" y="315" class="sketch-tick sketch-green">0.7</text>
      <text x="446" y="315" class="sketch-tick">1</text>
    </svg>
  </div>
  <figcaption>
    The same model, viewed in two directions: probability fixes $\theta$ and considers possible data; likelihood fixes $D$ and compares candidate values of $\theta$.
  </figcaption>
</figure>

## Maximum likelihood: let the data speak

As a frequentist: I treat $\theta$ as an unknown but fixed parameter and ask which value best explains the data. I.e. 'Maximum' likelihood.

The maximum-likelihood principle is:

$$
\hat{\theta}_{\mathrm{MLE}}
=
\arg\max_{\theta}P(D;\theta)
$$

In words:

> Given that I observed this specific data, which parameter would make it most likely that I observed exactly this data?

### A coin-toss model

Suppose I observe $n_H$ heads and $n_T$ tails. The parameter is:

$$
\theta=P(H),
\qquad
1-\theta=P(T)
$$

If I care about the exact order of the tosses, the likelihood is:

$$
P(D;\theta)
=
\theta^{n_H}(1-\theta)^{n_T}
$$

If I only record the number of heads and tails, rather than their order, the binomial coefficient also appears:

$$
P(D;\theta)
=
\binom{n_H+n_T}{n_H}
\theta^{n_H}(1-\theta)^{n_T}
$$

The combinatorial term does not contain $\theta$, so it will not affect the value of $\theta$ that maximizes the likelihood. I can carry it through the probability calculation, then safely ignore it during the optimization.

### Let's Maximise.

I can do the optimization in a few deliberate steps.

#### Step 1: Take the log

Starting from the parameter-dependent part of the likelihood:

$$
\ell(\theta)
=
\log P(D;\theta)
=
n_H\log(\theta)
+
n_T\log(1-\theta)
$$

> **P.S.** Taking the log does not change the location of the maximum because the logarithm is strictly increasing. It does turn products into sums, which are much easier to differentiate. It also avoids multiplying many tiny probabilities together.

#### Step 2: Differentiate

$$
\frac{d\ell}{d\theta}
=
\frac{n_H}{\theta}
-
\frac{n_T}{1-\theta}
$$

#### Step 3: Set the derivative to zero

At the stationary point:

$$
\frac{n_H}{\theta}
=
\frac{n_T}{1-\theta}
$$

Rearranging:

$$
n_H(1-\theta)=n_T\theta
$$

so:

$$
\boxed{
\hat{\theta}_{\mathrm{MLE}}
=
\frac{n_H}{n_H+n_T}
}
$$

The observed fraction of heads appears naturally.

<details class="math-detour">
  <summary>A brief verification</summary>
  <div class="math-detour-content">
    <p>Setting the derivative to zero only gives me a stationary point. This quick check tells me that, here, the point is actually the peak.</p>

    $$
    \frac{d^2\ell}{d\theta^2}
    =
    -\frac{n_H}{\theta^2}
    -
    \frac{n_T}{(1-\theta)^2}
    <0
    $$

    <p>For an interior value of $\theta$, with at least one head and one tail observed, both terms are negative. The log-likelihood is concave, so the stationary point is a maximum.</p>

    <p class="math-detour-caveat"><strong>Boundary case.</strong> If every toss has the same outcome, the MLE sits at $\theta=1$ or $\theta=0$, rather than at an interior stationary point.</p>
  </div>
</details>

### However... Cons:

If I observe ten tails and no heads, MLE gives:

$$
\hat{\theta}_{\mathrm{MLE}}=0
$$

That is the parameter value that best explains this particular sample. But it does not prove that the coin can never land heads.

With a small dataset, MLE can overfit the data.

> With the wrong model, MLE can be wrong!

This is where we can use the Bayesian way: a prior belief about which parameter values are plausible before I see the data.

## Maximum a posteriori: let the data meet a prior

As a Bayesian: the coin has one fixed but unknown bias $\theta$. It does not change from toss to toss.

Before seeing data, I might consider several values plausible:

- $\theta=0.5$ could be plausible.
- $\theta=0.7$ could be plausible.
- $\theta=0.9$ could be less plausible.

This uncertainty about the unknown bias is the prior distribution:

$$
P(\theta)
$$

Bayes' rule updates this prior using the likelihood:

$$
P(\theta\mid D)
=
\frac{P(D\mid\theta)P(\theta)}{P(D)}
$$

The pieces mean:

- $P(\theta)$ is my prior belief before seeing data.
- $P(D\mid\theta)$ is the likelihood of the data under $\theta$.
- $P(\theta\mid D)$ is the posterior belief after seeing data.
- $P(D)$ is the normalizing constant that makes the posterior a valid distribution.

For finding the most likely parameter, I can use proportionality:

$$
P(\theta\mid D)
\propto
P(D\mid\theta)P(\theta)
$$

The denominator does not depend on $\theta$, so it does not change which value maximizes the posterior.

My current intuition is:

> MLE explains the data you observed. MAP lets the data meet a prior, then asks which parameter is most plausible after hearing both.

### The Bayesian Way

Because $\theta$ must lie in $[0,1]$, a Beta distribution is a natural way to express my prior belief:

$$
\theta\sim\operatorname{Beta}(\alpha,\beta)
$$

Its density is:

$$
P(\theta)
=
\frac{\theta^{\alpha-1}(1-\theta)^{\beta-1}}
{B(\alpha,\beta)}
$$

$\alpha$ and $\beta$ control the shape of the prior. The beta function $B(\alpha,\beta)$ normalizes the density; it does not affect which value of $\theta$ maximizes it.

The useful part is conjugacy: the prior and likelihood fit together neatly. After observing $n_H$ heads and $n_T$ tails, I update the shape parameters to $\alpha+n_H$ and $\beta+n_T$. The posterior is still a Beta distribution, so the data updates my belief without introducing a new kind of distribution.

### Derivation

Multiplying the likelihood and the prior gives:

$$
P(\theta\mid D)
\propto
\theta^{n_H}(1-\theta)^{n_T}
\theta^{\alpha-1}(1-\theta)^{\beta-1}
$$

Collecting powers:

$$
P(\theta\mid D)
\propto
\theta^{n_H+\alpha-1}
(1-\theta)^{n_T+\beta-1}
$$

Therefore:

$$
\theta\mid D
\sim
\operatorname{Beta}(n_H+\alpha,n_T+\beta)
$$

The data updates the two shape parameters by adding the observed heads and tails.

### Maximizing the posterior

MAP chooses the mode of the posterior:

$$
\hat{\theta}_{\mathrm{MAP}}
=
\arg\max_{\theta}P(\theta\mid D)
$$

Taking logs gives the same useful pattern as before:

$$
\hat{\theta}_{\mathrm{MAP}}
=
\arg\max_{\theta}
\left[
\log P(D\mid\theta)
+
\log P(\theta)
\right]
$$

For the Beta-Bernoulli example, the log-posterior is:

$$
\ell_{\mathrm{MAP}}(\theta)
=
(n_H+\alpha-1)\log(\theta)
+
(n_T+\beta-1)\log(1-\theta)
$$

Differentiating and setting the result to zero gives the interior-mode estimate:

$$
\boxed{
\hat{\theta}_{\mathrm{MAP}}
=
\frac{n_H+\alpha-1}
{n_H+n_T+\alpha+\beta-2}
}
$$

This formula assumes the posterior has an interior mode. If either updated shape parameter is at most one, the mode can sit at zero or one instead.

### What the prior changes

In this conjugate example, the prior behaves like pseudo-counts. Informally, $\alpha-1$ acts like extra heads and $\beta-1$ acts like extra tails.

They are not real observations. They summarize how strongly the prior pulls the estimate away from the extremes.

Some consequences:

- MAP avoids giving all the authority to a tiny sample.
- As the dataset grows, a fixed prior usually matters less.
- A badly chosen prior can pull the estimate in the wrong direction.
- As $n\to\infty$, $\hat{\theta}&#95;{\mathrm{MAP}}\to\hat{\theta}&#95;{\mathrm{MLE}}$.

> The prior is useful precisely because the data is limited. That also means the prior has the most power to mislead me when the data is limited.

<details class="math-detour">
  <summary>Beyond MAP: full Bayesian prediction</summary>
  <div class="math-detour-content">
    <p>In the Bayesian view, $\theta$ is uncertain, so I represent that uncertainty with a posterior distribution $P(\theta\mid D)$. MAP then summarizes that distribution with its most probable value:</p>

    $$
    \hat{\theta}_{\mathrm{MAP}}
    =
    \arg\max_{\theta}P(\theta\mid D)
    $$

    <p>If I plug that single value into a prediction, I am making a plug-in MAP prediction. This is a useful approximation, but it is not the same as full Bayesian prediction.</p>

    <p>The posterior predictive distribution is:</p>

    $$
    P(Y\mid X,D)
    =
    \int_{\Theta}
    P(Y\mid X,\theta)P(\theta\mid D)\,d\theta
    $$

    <p>Here, $X$ is the test input, $Y$ is its unknown label, and $D$ is the training data. I make a prediction under every plausible parameter value, then weight each prediction by how credible that parameter is after seeing the data.</p>
    
    <p>So I interpret it as getting rid of the need to commit to one fitted point model. The underlying model family remains; I am averaging over uncertainty about its parameters.</p>

  </div>
</details>
