---
title: "Logistic Regression"
date: 2026-10-13
updated: 2026-10-13
course: "Cornell CS4780"
status: "Completed"
math: true
tags:
  - machine learning
  - probability
  - classification
  - logistic regression
trail:
  - Machine Learning
  - Classification
  - Logistic Regression
summary: "How logistic regression takes the sigmoid form that naive Bayes produces and estimates its weights directly, with MLE and MAP."
thinking_excerpt: "If naive Bayes ends up with this form anyway, why not estimate w and b directly?"
---

Naive Bayes is a generative algorithm. Generative algorithms learn what the data distribution looks like. A discriminative algorithm instead focuses on separating the classes from the features directly. With spam, the two ask different questions:

- **Generative:** what do spam emails and non-spam emails look like?
- **Discriminative:** given this email's features, should I classify it as spam or not spam?

Logistic regression is the discriminative counterpart of naive Bayes. It learns the weights $\mathbf{w}$ and bias $b$ directly, to fit the conditional probability of the labels, $P(y\mid\mathbf{x})$.

## From naive Bayes to logistic regression

At the end of my [naive Bayes note]({{ '/notes/bayes-classifier-naive-bayes/' | relative_url }}), Gaussian naive Bayes (with the same variance in both classes) gave us this expression:

$$
P(y\mid\mathbf{x})=\frac{1}{1+e^{-y(\mathbf{w}^\top\mathbf{x}+b)}},
\qquad
y\in\{+1,-1\}
$$

Naive Bayes reached it the long way round: model how the data is generated in each class, estimate those distributions, and let $\mathbf{w}$ and $b$ fall out. But if we are only interested in $P(y\mid\mathbf{x})$, and we know it ends up in this form, we can just estimate $\mathbf{w}$ and $b$ directly.

| Model | What it estimates | Approach |
| --- | --- | --- |
| Naive Bayes | $P(\mathbf{x}\mid y)$ and $P(y)$ | Generative |
| Logistic regression | $P(y\mid\mathbf{x})$ | Discriminative |

So naive Bayes gives us the formula above as a result. In logistic regression, that form is now our assumption.

<details class="math-detour">
  <summary><span>Where did $b$ go?</span></summary>
  <div class="math-detour-content">
    <p>From here on, I write the score as $\mathbf{w}^\top\mathbf{x}$ instead of $\mathbf{w}^\top\mathbf{x}+b$. The bias has not disappeared. It is absorbed into $\mathbf{w}$ by adding a constant feature of 1 to every input:</p>

    $$
    \mathbf{x}\leftarrow\begin{bmatrix}\mathbf{x}\\1\end{bmatrix},
    \qquad
    \mathbf{w}\leftarrow\begin{bmatrix}\mathbf{w}\\b\end{bmatrix}
    $$

    <p>Then the new $\mathbf{w}^\top\mathbf{x}$ equals the old $\mathbf{w}^\top\mathbf{x}+b$, and there is only one parameter vector to estimate.</p>
  </div>
</details>

## Estimating w with MLE

To find $\mathbf{w}$, I ask the MLE question: what is the probability of getting the particular labels I observed, given the inputs and $\mathbf{w}$?

$$
P(\mathbf{y}\mid X,\mathbf{w})=\prod_{i=1}^{n}P(y_i\mid\mathbf{x}_i,\mathbf{w})
$$

Here $X$ holds all $n$ training inputs and $\mathbf{y}$ holds their labels. The product comes from assuming the training examples are independent of one another. MLE picks the $\mathbf{w}$ that makes the observed labels most likely:

$$
\hat{\mathbf{w}}_{MLE}
=
\arg\max_{\mathbf{w}}\prod_{i=1}^{n}P(y_i\mid\mathbf{x}_i,\mathbf{w})
$$

Just like in my [MLE and MAP note]({{ '/notes/mle-map-probabilistic-classification/' | relative_url }}), a product of many probabilities is awkward to work with, so I take the log. Since log is monotonic, the maximizer does not change, and the product becomes a sum:

$$
\begin{aligned}
\hat{\mathbf{w}}_{MLE}
&=
\arg\max_{\mathbf{w}}\sum_{i=1}^{n}\log P(y_i\mid\mathbf{x}_i,\mathbf{w})
\\
&=
\arg\max_{\mathbf{w}}\sum_{i=1}^{n}\log\frac{1}{1+e^{-y_i\mathbf{w}^\top\mathbf{x}_i}}
\\
&=
\arg\max_{\mathbf{w}}\ -\sum_{i=1}^{n}\log\left(1+e^{-y_i\mathbf{w}^\top\mathbf{x}_i}\right)
&&\text{(since $\log\tfrac{1}{a}=-\log a$)}
\end{aligned}
$$

Maximizing a negative is the same as minimizing the positive, so we can make it a minimization problem and remove the minus:

$$
\hat{\mathbf{w}}_{MLE}
=
\arg\min_{\mathbf{w}}\sum_{i=1}^{n}\log\left(1+e^{-y_i\mathbf{w}^\top\mathbf{x}_i}\right)
$$

We can call this our loss function $\ell(\mathbf{w})$.

### What the loss measures

Each training point adds one term $\log(1+e^{-z_i})$, where $z_i=y_i\mathbf{w}^\top\mathbf{x}_i$. The sign of $z_i$ says whether the point is on the correct side of the boundary, and its size says how confidently.

<figure class="concept-diagram sigmoid-diagram">
  <svg viewBox="0 0 640 300" role="img" aria-label="The logistic loss curve" aria-describedby="logistic-loss-desc">
    <desc id="logistic-loss-desc">A curve that is high and almost straight for negative z, passes through log 2 at z equals 0, and flattens towards 0 for positive z.</desc>
    <path d="M70 250H610" />
    <path d="M340 262V30" />
    <path class="constraint" d="M80.0 49.1 L90.8 57.3 L101.7 65.4 L112.5 73.5 L123.3 81.6 L134.2 89.6 L145.0 97.6 L155.8 105.5 L166.7 113.3 L177.5 121.1 L188.3 128.7 L199.2 136.2 L210.0 143.7 L220.8 150.9 L231.7 158.0 L242.5 164.9 L253.3 171.6 L264.2 178.1 L275.0 184.3 L285.8 190.3 L296.7 195.9 L307.5 201.3 L318.3 206.3 L329.2 211.0 L340.0 215.3 L350.8 219.3 L361.7 223.0 L372.5 226.3 L383.3 229.3 L394.2 232.0 L405.0 234.3 L415.8 236.4 L426.7 238.3 L437.5 239.9 L448.3 241.3 L459.2 242.6 L470.0 243.7 L480.8 244.6 L491.7 245.4 L502.5 246.1 L513.3 246.6 L524.2 247.1 L535.0 247.6 L545.8 247.9 L556.7 248.2 L567.5 248.5 L578.3 248.7 L589.2 248.9 L600.0 249.1" />
    <circle cx="340" cy="215.3" r="7" />
    <text x="328" y="244" text-anchor="end">0</text>
    <text x="354" y="206">log 2</text>
    <text class="constraint-label" x="215" y="110">log(1 + e<tspan baseline-shift="super" font-size="75%">−z</tspan>)</text>
    <text class="contour-label" x="80" y="284">confidently wrong</text>
    <text class="contour-label" x="340" y="284" text-anchor="middle">z = 0</text>
    <text class="contour-label" x="600" y="284" text-anchor="end">confidently right</text>
  </svg>
  <figcaption>The loss for one point against $z=y\,\mathbf{w}^\top\mathbf{x}$. Points on the wrong side cost a lot, points on the boundary cost $\log 2$, and confidently correct points cost almost nothing.</figcaption>
</figure>

So the loss is not literally a count of the points we get wrong. It is a smooth version of that idea: it charges more the more confidently wrong a point is, and it still charges a little for correct points that sit close to the boundary.

Turns out this function is very well behaved: it is continuous, differentiable, and convex. Convex means there are no local minima to get stuck in, so any minimum we find is the global one.

The catch is that, unlike the coin-toss example in my MLE and MAP note, setting the derivative to zero does not give a closed-form answer for $\mathbf{w}$. Instead, we find the minimum iteratively: start from some $\mathbf{w}$ and keep improving it. Gradient descent is one way to do this, but not the only one. Newton's method, for example, also uses the curvature of the loss to take better steps.

## Adding a prior with MAP

With MAP, instead of asking which $\mathbf{w}$ makes the data most likely, we ask which $\mathbf{w}$ is most plausible after seeing the data. By Bayes' rule:

$$
P(\mathbf{w}\mid D)\propto P(D\mid\mathbf{w})\,P(\mathbf{w})
$$

The first factor is exactly the likelihood we just maximized with MLE. The new part is the prior $P(\mathbf{w})$: what we believe about $\mathbf{w}$ before seeing any data.

A common choice is a Gaussian prior centred at zero, $\mathbf{w}\sim\mathcal{N}(\mathbf{0},\sigma^2 I)$. This says we expect the weights to be small, and we are less and less willing to believe in large ones. Taking logs and flipping the sign as before:

$$
\begin{aligned}
\hat{\mathbf{w}}_{MAP}
&=
\arg\max_{\mathbf{w}}\log\big(P(\mathbf{y}\mid X,\mathbf{w})\,P(\mathbf{w})\big)
\\
&=
\arg\min_{\mathbf{w}}\sum_{i=1}^{n}\log\left(1+e^{-y_i\mathbf{w}^\top\mathbf{x}_i}\right)+\lambda\,\mathbf{w}^\top\mathbf{w}
\end{aligned}
$$

<details class="math-detour">
  <summary><span>Where does $\lambda\,\mathbf{w}^\top\mathbf{w}$ come from?</span></summary>
  <div class="math-detour-content">
    <p>The log of the Gaussian prior is:</p>

    $$
    \log P(\mathbf{w})
    =
    -\frac{\mathbf{w}^\top\mathbf{w}}{2\sigma^2}+\text{const}
    $$

    <p>The log turns the product $P(\mathbf{y}\mid X,\mathbf{w})\,P(\mathbf{w})$ into a sum, so this term is added to the log-likelihood. Flipping the sign to turn the argmax into an argmin gives $+\frac{1}{2\sigma^2}\mathbf{w}^\top\mathbf{w}$, and the constant does not affect which $\mathbf{w}$ wins. So:</p>

    $$
    \lambda=\frac{1}{2\sigma^2}
    $$

    <p>A small $\sigma$ means a strong belief that the weights are near zero, which gives a large $\lambda$ and a stronger pull towards zero.</p>
  </div>
</details>

The MAP loss is the MLE loss plus a penalty on the size of $\mathbf{w}$. This is L2 regularization, and here it comes straight out of the prior rather than being added by hand.

Why is it sensible to prefer small weights? How far $\mathbf{w}$ is from zero is a measure of how complex the hyperplane we learn is. If we have to go really far away, with very large weights, to fit the training data, then we are learning something more complicated. The boundary is still a flat hyperplane, but the model becomes extremely confident, and a small change in one feature can swing a prediction from one class to the other. That is often a sign the model is fitting noise in the training data. The penalty $\lambda\,\mathbf{w}^\top\mathbf{w}$ pulls towards the simplest $\mathbf{w}$ that still explains the data.

<details class="math-detour">
  <summary><span>Why would MLE need this?</span></summary>
  <div class="math-detour-content">
    <p>Suppose the training data can be perfectly separated by a hyperplane. Then every $z_i=y_i\mathbf{w}^\top\mathbf{x}_i$ is positive. Doubling $\mathbf{w}$ doubles every $z_i$, which pushes every term of the loss closer to 0. So the MLE loss keeps decreasing as $\mathbf{w}$ grows, and the "best" $\mathbf{w}$ has infinite length.</p>

    <p>The penalty $\lambda\,\mathbf{w}^\top\mathbf{w}$ grows with the length of $\mathbf{w}$, so it stops this. The minimum is now a finite $\mathbf{w}$ that balances fitting the data against staying small.</p>
  </div>
</details>

## Naive Bayes or logistic regression?

Both models end up with the same form for $P(y\mid\mathbf{x})$. The difference is how they get $\mathbf{w}$.

Naive Bayes first models $P(\mathbf{x}\mid y)$ for each label, and the decision boundary follows from those distributions. Logistic regression never models $P(\mathbf{x}\mid y)$ at all. It assumes only the sigmoid form of $P(y\mid\mathbf{x})$ and searches for $\mathbf{w}$ directly.

That makes logistic regression more flexible. The sigmoid form is not specific to Gaussians: my naive Bayes note showed that multinomial features give it too, and it arises for a much wider family of distributions (the exponential family). Logistic regression does not need to know which one the data actually follows.

The tradeoff is data:

- **Little data, correct assumptions:** naive Bayes tends to do better. Its assumptions act as extra information, so it needs fewer examples.
- **Lots of data:** logistic regression often does better, because the assumptions naive Bayes makes about $P(\mathbf{x}\mid y)$ are rarely exactly true, and with enough data, being free of them matters more.
- **Assumptions exactly true:** if the data really is drawn from the distribution naive Bayes assumes, the two converge to the same result in the limit, but naive Bayes gets there faster.

This tradeoff comes from [Ng and Jordan (NeurIPS 2001)](https://papers.nips.cc/paper/2001/hash/7b7a53e239400a13bd6be6c91c4f6c4e-Abstract.html), who compared exactly these two models. Logistic regression reaches a lower error in the limit, but naive Bayes approaches its own, higher, limit much faster.

## Minimizing a loss

Logistic regression has now become:

$$
\min_{\mathbf{w}}\ \ell(\mathbf{w})
$$

This form is not special to logistic regression. Many machine learning algorithms can be written this way: choose a loss that measures how badly $\mathbf{w}$ fits the training data, then find the $\mathbf{w}$ that minimizes it.

There are many ways to find the minimum of a loss function. For logistic regression, $\mathbf{w}$ can be any vector, so this is an unconstrained problem. Since there is no closed-form answer, we use hill-climbing algorithms, which start somewhere and keep improving. Gradient descent and Newton's method are two of them, and they are the topic of my next note.
