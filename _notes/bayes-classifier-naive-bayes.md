---
title: "Bayes Classifier and Naive Bayes"
date: 2026-08-05
updated: 2026-10-12
course: "Cornell CS4780"
status: "Completed"
math: true
tags:
  - machine learning
  - probability
  - classification
  - naive bayes
trail:
  - Machine Learning
  - Probability
  - Classification
summary: "My intuition on the Bayes classifier and naive Bayes assumption"
thinking_excerpt: "A perspective on classifiers"
---

To understand why we need the naive Bayes assumption, we first need to see why and when the Bayes classifier breaks down.

## The Bayes classifier

The Bayes classifier predicts the most likely label $y$ given the feature vector $\mathbf{x}$:

$$
h(\mathbf{x})
=
\arg\max_{y}
P(y\mid\mathbf{x})
$$

This rule is also called the Bayes optimal classifier: if we knew the true $P(y\mid\mathbf{x})$, no other classifier could make fewer mistakes on average. In practice, we never know it. We only have training data, so we must estimate $P(y\mid\mathbf{x})$ from that data, and this is where the Bayes classifier breaks down.

To see why, start from the definition of conditional probability:

$$
P(y\mid\mathbf{x})
=
\frac{P(\mathbf{x},y)}{P(\mathbf{x})}
=
\frac{P(\mathbf{x},y)}{\sum_{y'}P(\mathbf{x},y')}
$$

You will usually see this written as:

$$
P(A\mid B)
=
\frac{P(A\cap B)}{P(B)}
$$

with the label $y$ playing the role of $A$ and the features $\mathbf{x}$ playing the role of $B$.

<details class="math-detour">
  <summary><span>Where does the denominator come from?</span></summary>
  <div class="math-detour-content">
    <p>$P(\mathbf{x})$ is the probability of observing the features $\mathbf{x}$, regardless of what the label is.</p>

    <p>For example, suppose there are 4 possible labels, $y\in\{\text{cat},\text{dog},\text{mouse},\text{horse}\}$. Then there are 4 mutually exclusive ways for $\mathbf{x}$ to occur: together with cat, with dog, with mouse, or with horse. So we add them together:</p>

    $$
    \begin{aligned}
    P(\mathbf{x})
    &=
    P(\mathbf{x},\text{cat})
    +
    P(\mathbf{x},\text{dog})
    \\
    &\quad+
    P(\mathbf{x},\text{mouse})
    +
    P(\mathbf{x},\text{horse})
    \end{aligned}
    $$

    <p>More generally:</p>

    $$
    P(\mathbf{x})
    =
    \sum_{y'}P(\mathbf{x},y')
    $$

    <p>$y'$ is just a dummy variable: the sum runs over every possible label. It is written $y'$ rather than $y$ so it is not confused with the specific label $y$ in the numerator. This is the law of total probability.</p>
  </div>
</details>

## Estimating it by counting

Now the numerator. The simplest estimate of $P(\mathbf{x},y)$ comes from counting:

$$
\hat{P}(\mathbf{x},y)
=
\frac{\sum_{i=1}^{n}I(\mathbf{x}_i=\mathbf{x}\wedge y_i=y)}{n}
$$

This is the number of training examples with $\mathbf{x}_i=\mathbf{x}$ and $y_i=y$, divided by the total number of training examples. The hat marks it as an estimate from data rather than the true probability. It is the same counting idea as the coin-toss MLE in my [MLE and MAP note]({{ '/notes/mle-map-probabilistic-classification/' | relative_url }}).

The denominator is estimated the same way:

$$
\hat{P}(\mathbf{x})
=
\frac{\sum_{i=1}^{n}I(\mathbf{x}_i=\mathbf{x})}{n}
$$

This agrees with the sum over labels above: adding up the joint counts for every label $y'$ counts every training example with $\mathbf{x}_i=\mathbf{x}$.

Putting both together, the $\frac{1}{n}$ cancels:

$$
\begin{aligned}
\hat{P}(y\mid\mathbf{x})
&=
\frac{\hat{P}(\mathbf{x},y)}{\hat{P}(\mathbf{x})}
\\
&=
\frac{\sum_{i=1}^{n}I(\mathbf{x}_i=\mathbf{x}\wedge y_i=y)}{\sum_{i=1}^{n}I(\mathbf{x}_i=\mathbf{x})}
\end{aligned}
$$

In words: among the training examples that look exactly like $\mathbf{x}$, the fraction that have label $y$.

## Where it breaks down

The problem is that when $\mathbf{x}$ has many features (a large dimension $d$), it is very hard to estimate the label for that exact test point. If $d$ is large, it is rare to see the exact same data point in the training set. Then both counts are zero, the estimate becomes $\frac{0}{0}$, and it tells us nothing.

## Rewriting with Bayes' rule

So instead, we can use Bayes' rule:

$$
P(y\mid\mathbf{x})
=
\frac{P(\mathbf{x},y)}{P(\mathbf{x})}
=
\frac{P(\mathbf{x}\mid y)P(y)}{P(\mathbf{x})}
$$

Now we estimate $P(y)$ and $P(\mathbf{x}\mid y)$.

Estimating $P(y)$ is straightforward. It is the fraction of training examples with label $c$:

$$
\hat{P}(y=c)
=
\frac{\sum_{i=1}^{n}I(y_i=c)}{n}
=
\hat{\pi}_c
$$

However, $P(\mathbf{x}\mid y)$ is complicated. Bayes' rule on its own has not removed the problem: estimating $P(\mathbf{x}\mid y)$ by counting still needs the exact $\mathbf{x}$ to appear in the training data, now among the examples with label $y$. What Bayes' rule gives us is a form we can simplify with an assumption.

<details class="math-detour">
  <summary><span>Why is $P(\mathbf{x}\mid y)$ so hard to estimate?</span></summary>
  <div class="math-detour-content">
    <p>$\mathbf{x}$ can contain many features, creating an enormous number of possible combinations.</p>

    <p>If each feature is binary (two possible values, like spam or not spam) and there are 30 features, there are $2^{30}$ possible different combinations.</p>

    <p>That is over 1 billion possible feature combinations, so most combinations will have appeared 0 times in the training data. We might get $\hat{P}(\mathbf{x}\mid y)=0$.</p>
  </div>
</details>

## The naive assumption

Therefore, we make the "naive" assumption, which gives naive Bayes its name:

> Given the label $y$, the features are conditionally independent of one another.

Writing $x_\alpha$ for the $\alpha$-th feature of $\mathbf{x}$:

$$
P(x_1,x_2,\ldots,x_d\mid y)
=
\prod_{\alpha=1}^{d}P(x_\alpha\mid y)
$$

Each $P(x_\alpha\mid y)$ now involves only one feature, so it can be estimated from many training examples. With 30 binary features, instead of one probability for each of the $2^{30}$ combinations, we need one probability per feature for each class: 30 numbers per class.

This does not mean that the features are independent everywhere. It means that, once we know the class, we ignore the remaining dependence between them.

That assumption may be visibly false. For example, the words "free" and "prize" may appear together more often than chance would suggest. Naive Bayes still treats their contributions separately after conditioning on whether the message is spam.

## Back to the classifier

Going back to the top:

$$
\begin{aligned}
h(\mathbf{x})
&=
\arg\max_{y}P(y\mid\mathbf{x})
\\
&=
\arg\max_{y}\frac{P(\mathbf{x}\mid y)P(y)}{P(\mathbf{x})}
\\
&=
\arg\max_{y}P(\mathbf{x}\mid y)P(y)
&&\text{($P(\mathbf{x})$ does not depend on $y$)}
\\
&=
\arg\max_{y}\prod_{\alpha=1}^{d}P(x_\alpha\mid y)\,P(y)
&&\text{(by the naive Bayes assumption)}
\\
&=
\arg\max_{y}\sum_{\alpha=1}^{d}\log P(x_\alpha\mid y)+\log P(y)
&&\text{(as $\log$ is a monotonic function)}
\end{aligned}
$$



From here, there are a few different scenarios where we can use the naive Bayes classifier. Each one depends on what kind of features we have.

## Categorical Naive Bayes

### The setup

Suppose each data point has several categorical features and a label $y$. For example, for a patient:

$$
\mathbf{x}=(\text{gender},\ \text{marital status})
$$

Each feature takes one of a few categories:

- gender: male, female
- marital status: single, married, widowed

And the label might be:

- disease or no disease

Conceptually, we can think of each feature as a die. Each class gets its own set of dice, so we have 4 dice in total:

1. 2 dice for disease patients: one for gender, one for marital status
2. 2 dice for non-disease patients: one for gender, one for marital status

Each die represents the probability distribution of one feature given the class. Its faces are the feature's categories, so the gender die has 2 faces and the marital status die has 3.

The assumption that we can roll a separate die independently for each feature, once the class is known, is the naive assumption.

We can write the categories of feature $\alpha$ as:

$$
x_\alpha\in\{f_1,f_2,\ldots,f_{K_\alpha}\}
$$

where $K_\alpha$ is the number of categories, or faces on the die. So for gender, $K_\alpha=2$ and $x_\alpha\in\lbrace\text{male},\text{female}\rbrace$. For marital status, $K_\alpha=3$.

### Estimating the parameters

The probability of each face is a parameter of the model. Writing $j$ for category $f_j$:

$$
P(x_\alpha=j\mid y=c)=[\theta_{jc}]_\alpha
$$

> The probability that feature $\alpha$ takes category $j$, given that the class is $c$, is $[\theta_{jc}]_\alpha.$

We do not know these probabilities, so we estimate them from the training data by counting:

$$
[\hat{\theta}_{jc}]_\alpha
=
\frac{\sum_{i=1}^{n}I(y_i=c)\,I(x_{i\alpha}=j)+l}{\sum_{i=1}^{n}I(y_i=c)+lK_\alpha}
$$

where $x_{i\alpha}$ is feature $\alpha$ of training example $i$, and $l$ is a smoothing parameter.

Without smoothing ($l=0$), this is just:

$$
[\hat{\theta}_{jc}]_\alpha
=
\frac{\#\text{ label } c \text{ with category } j}{\#\text{ label } c}
$$

With $l>0$, we pretend we have seen every category $l$ extra times in each class. That adds $l$ to the numerator, and $lK_\alpha$ to the denominator because there are $K_\alpha$ categories. This stops a category we never saw in a class from getting probability 0. Setting $l=1$ is called Laplace smoothing, and any $l>0$ corresponds to a MAP estimate (see my [MLE and MAP note]({{ '/notes/mle-map-probabilistic-classification/' | relative_url }})).

### Prediction

Once we have estimated the parameters, we do prediction: we use the learned model to decide the label of a new data point.

From what we learnt above, with many features it is hard to estimate $P(y\mid\mathbf{x})$ directly. So we estimate $P(y)$ and $P(\mathbf{x}\mid y)$ instead, with the naive Bayes assumption. We want:

$$
\arg\max_{y}P(y\mid\mathbf{x})
$$

Using Bayes' rule, this is the same as:

$$
\arg\max_{y}P(\mathbf{x}\mid y)P(y)
$$

Using the naive Bayes assumption:

$$
\arg\max_{y}\left[\prod_{\alpha=1}^{d}P(x_\alpha\mid y)\right]P(y)
$$

And because we do not know the true probabilities, we plug in our estimated parameters:

$$
\hat{y}
=
\arg\max_{c}\ \hat{\pi}_c\prod_{\alpha=1}^{d}[\hat{\theta}_{jc}]_\alpha
$$

where $\hat{\pi}_c$ is the class prior estimate from earlier, and for each feature $\alpha$, $j$ is the category the new data point actually has. In words: for each class, multiply its prior by the probability of each of the new point's categories, and pick the class with the highest score.

### The whole flow

So all in all:

1. **Training:** training data $\longrightarrow$ parameter estimation $\longrightarrow$ $\hat{\pi}\_c$ and $[\hat{\theta}\_{jc}]\_\alpha$. This happens once.
2. **Prediction:** new input $\mathbf{x}$ and the estimated parameters $\longrightarrow$ $\hat{y}$. This happens for every new data point.

## Multinomial Naive Bayes

### The setup

In a multinomial model, instead of one die per class for every feature, we now have just one die per class. Each roll of the die chooses a word from the vocabulary, so to write an email of $m$ words, we roll the class's die $m$ times.

Imagine two dice:

| Die | free | money | meeting |
| --- | --- | --- | --- |
| Spam die | 60% | 30% | 10% |
| Not spam die | 10% | 10% | 80% |

The same words have different probabilities in spam and non-spam emails.

The assumption that each roll is independent of the others, once the class is known, is the naive assumption.

The feature values can be denoted as:

$$
x_\alpha\in\{0,1,2,\ldots,m\}
$$

and

$$
m=\sum_{\alpha=1}^{d}x_\alpha
$$

Take the email "free money free" as an example:

| Symbol | Intuition | Example |
| --- | --- | --- |
| $d$ | Number of words in the vocabulary | $d=3$ |
| $\alpha$ | Index of a particular word | $\alpha=1$ means "free" |
| $x_\alpha$ | Number of occurrences of that word | $x_1=2$ |
| $m$ | Total number of words counted | $m=3$ |
| $\theta_{\alpha c}$ | Probability that one roll of the class $c$ die gives word $\alpha$ | $\theta_{\text{free},\text{spam}}=0.6$ |

The feature vector records the count of each word, not the order in which the words appeared. So in an email, the order of the words does not matter.

### The probability of an email

Therefore, given the email length $m$ and the class $c$, we have:

$$
P(\mathbf{x}\mid m,y=c)
=
\frac{m!}{x_1!\,x_2!\cdots x_d!}
\prod_{\alpha=1}^{d}(\theta_{\alpha c})^{x_\alpha}
$$

The factorial term counts how many distinct arrangements exist: all the different word orders that produce the same counts. The product is the probability of any one of those orders.

For "free money free", there are $3!/(2!\,1!\,0!)=3$ orders: free free money, free money free, and money free free. With the spam die, each order has probability $0.6^2\times0.3=0.108$, so the email has probability $3\times0.108=0.324$. With the not spam die, it is only $3\times0.1^2\times0.1=0.003$.

<details class="math-detour">
  <summary><span>In practice, the constant can be omitted. Why?</span></summary>
  <div class="math-detour-content">
    <p>Ultimately, we want to classify an email as spam or not spam. We can compare the two classes with a ratio:</p>

    $$
    \frac{P(y=\text{spam}\mid\mathbf{x})}{P(y=\text{not spam}\mid\mathbf{x})}
    $$

    <p>If the ratio is greater than 1, we classify the email as spam. If it is less than 1, we classify it as not spam.</p>

    <p>When we write each posterior with Bayes' rule, the factorial term appears in both the numerator and the denominator, because it depends only on the counts in $\mathbf{x}$, not on the class. So it cancels out, and so does $P(\mathbf{x})$. The same is true when we take the argmax over classes.</p>

    <p>The class changes how likely each arrangement is (the product of the $\theta$s), not how many arrangements there are (the constant).</p>
  </div>
</details>

### Estimating the parameters

Again, similar to categorical features, we estimate the parameters by counting:

$$
\hat{\theta}_{\alpha c}
=
\frac{\sum_{i=1}^{n}I(y_i=c)\,x_{i\alpha}+l}{\sum_{i=1}^{n}I(y_i=c)\,m_i+ld}
$$

where $x_{i\alpha}$ is the number of times word $\alpha$ appears in training email $i$, and $m_i$ is the total number of words in that email. In words:

$$
\hat{\theta}_{\alpha c}
=
\frac{\#\text{ word }\alpha\text{ in class }c+l}{\#\text{ words in class }c+ld}
$$

Unlike the categorical case, the denominator counts words, not emails: we pool every word from every class $c$ email. Smoothing adds $l$ for each of the $d$ words in the vocabulary, which is where $ld$ comes from.

### Prediction

Once we have the estimated parameters, we can classify (i.e. predict) a new email by picking the class with the highest $P(y\mid\mathbf{x})$. Dropping the constant:

$$
\hat{y}
=
\arg\max_{c}\
\underbrace{\hat{\pi}_c}_{\text{class prior}}\
\underbrace{\prod_{\alpha=1}^{d}\hat{\theta}_{\alpha c}^{\,x_\alpha}}_{\text{word evidence}}
$$

For "free money free" with equal class priors, spam scores $0.5\times0.108=0.054$ and not spam scores $0.5\times0.001=0.0005$, so we predict spam.

## Tying it together: naive Bayes as a linear classifier

Tying everything together, we can use naive Bayes as a linear classifier. Take the multinomial spam example, and write the labels as $y=+1$ for spam and $y=-1$ for not spam. We classify an email as spam if:

$$
P(y=+1\mid\mathbf{x})>P(y=-1\mid\mathbf{x})
$$

Using Bayes' rule, $P(\mathbf{x})$ is the same on both sides, so it cancels. Writing $+1$ and $-1$ for short:

$$
P(\mathbf{x}\mid +1)\,P(+1)>P(\mathbf{x}\mid -1)\,P(-1)
$$

Plugging in the multinomial model, the factorial term is also the same on both sides, so it cancels too:

$$
\hat{\pi}_{+}\prod_{\alpha=1}^{d}\hat{\theta}_{\alpha+}^{\,x_\alpha}
>
\hat{\pi}_{-}\prod_{\alpha=1}^{d}\hat{\theta}_{\alpha-}^{\,x_\alpha}
$$

Taking logs (log is monotonic, so the inequality does not change):

$$
\begin{aligned}
&\log\hat{\pi}_{+}+\sum_{\alpha=1}^{d}x_\alpha\log\hat{\theta}_{\alpha+}
\\
&\quad>
\log\hat{\pi}_{-}+\sum_{\alpha=1}^{d}x_\alpha\log\hat{\theta}_{\alpha-}
\end{aligned}
$$

Moving everything to the left and grouping the terms by $x_\alpha$:

$$
\begin{aligned}
&\underbrace{\log\hat{\pi}_{+}-\log\hat{\pi}_{-}}_{b}
\\
&\quad+\sum_{\alpha=1}^{d}x_\alpha\underbrace{\left(\log\hat{\theta}_{\alpha+}-\log\hat{\theta}_{\alpha-}\right)}_{w_\alpha}>0
\end{aligned}
$$

which is exactly:

$$
\mathbf{w}^\top\mathbf{x}+b>0
$$

If $P(y=+1\mid\mathbf{x})<P(y=-1\mid\mathbf{x})$ instead, every step flips and we get $\mathbf{w}^\top\mathbf{x}+b<0$. So the decision boundary is $\mathbf{w}^\top\mathbf{x}+b=0$, a hyperplane, which is why we can use naive Bayes as a linear classifier.

Each weight $w_\alpha$ belongs to one word in the vocabulary, and compares how likely that word is under the spam die and the not spam die.

For example, take the word "free". From the dice above, the spam die gives "free" 60% of the time and the not spam die only 10% of the time. So its weight is:

$$
w_{\text{free}}=\log0.6-\log0.1\approx1.79
$$

Since $\mathbf{w}^\top\mathbf{x}=\sum_{\alpha}w_\alpha x_\alpha$, every "free" in an email adds 1.79 to the score, pushing it towards spam (a score above 0). 

Notice how we got here. We never searched for $\mathbf{w}$ and $b$ directly. We first modelled how the data is generated in each class: we chose a distribution for $P(\mathbf{x}\mid y)$ (categorical, multinomial, and so on) and estimated its parameters. The decision boundary then followed from that model. The boundary is only as good as the model: if the chosen distribution describes the data badly, we get the wrong boundary.

Compare this with the perceptron, which looks for $\mathbf{w}$ and $b$ directly by updating them every time it misclassifies a point. It keeps updating until it finds a boundary that separates the data. However, if no such boundary exists, it never stops updating. Naive Bayes does not have this problem: it gets $\mathbf{w}$ and $b$ in one pass, by counting, whether or not the data can be separated.

### Gaussian features and the sigmoid form of P(y | x)

Similarly, we can do the same with a Gaussian distribution for continuous features: just like we did for multinomial, we plug it into the naive Bayes formula. As long as each feature has the same variance in both classes, we get:

$$
P(y=+1\mid\mathbf{x})=\frac{1}{1+e^{-(\mathbf{w}^\top\mathbf{x}+b)}}
$$

<details class="math-detour">
  <summary><span>Why does the Gaussian give this form?</span></summary>
  <div class="math-detour-content">
    <p>Take one feature $x_\alpha$. In each class it follows a Gaussian with its own mean, $\mu_{\alpha+}$ or $\mu_{\alpha-}$, but the same variance $\sigma_\alpha^2$. The log of a Gaussian density is:</p>

    $$
    \log\mathcal{N}(x_\alpha;\mu,\sigma_\alpha^2)
    =
    -\frac{(x_\alpha-\mu)^2}{2\sigma_\alpha^2}+\text{const}
    $$

    <p>Subtracting the two classes and expanding the squares, the $x_\alpha^2$ terms cancel, because the variance is the same in both:</p>

    $$
    \begin{aligned}
    \log\frac{P(x_\alpha\mid +1)}{P(x_\alpha\mid -1)}
    &=
    \frac{\mu_{\alpha+}-\mu_{\alpha-}}{\sigma_\alpha^2}\,x_\alpha
    \\
    &\quad+
    \frac{\mu_{\alpha-}^2-\mu_{\alpha+}^2}{2\sigma_\alpha^2}
    \end{aligned}
    $$

    <p>This is linear in $x_\alpha$. By the naive assumption, the log ratio for the whole $\mathbf{x}$ is the sum of these terms over all features, plus $\log\frac{\pi_+}{\pi_-}$ from the priors. So it has the form $\mathbf{w}^\top\mathbf{x}+b$, with:</p>

    $$
    w_\alpha=\frac{\mu_{\alpha+}-\mu_{\alpha-}}{\sigma_\alpha^2}
    $$

    <p>and $b$ collecting all the constant terms.</p>

    <p class="math-detour-caveat"><strong>Different variances.</strong> If the variances differ between the classes, the $x_\alpha^2$ terms do not cancel. The log ratio is then quadratic, and the boundary is curved rather than linear.</p>
  </div>
</details>

The multinomial case gives exactly the same form: the derivation above already showed that its log ratio is $\mathbf{w}^\top\mathbf{x}+b$ too.

<details class="math-detour">
  <summary><span>How do we get from the log ratio to this form?</span></summary>
  <div class="math-detour-content">
    <p>In both cases, the log of the ratio of the two posteriors is the linear score:</p>

    $$
    \log\frac{P(y=+1\mid\mathbf{x})}{P(y=-1\mid\mathbf{x})}=\mathbf{w}^\top\mathbf{x}+b
    $$

    <p>Write $p=P(y=+1\mid\mathbf{x})$ and $z=\mathbf{w}^\top\mathbf{x}+b$. Since the two probabilities add up to 1, $P(y=-1\mid\mathbf{x})=1-p$, so:</p>

    $$
    \frac{p}{1-p}=e^{z}
    $$

    <p>Multiplying out and collecting the $p$ terms:</p>

    $$
    p=e^{z}(1-p)
    \quad\Longrightarrow\quad
    p\,(1+e^{z})=e^{z}
    $$

    <p>Dividing both sides by $1+e^{z}$, then dividing the top and bottom by $e^{z}$:</p>

    $$
    p=\frac{e^{z}}{1+e^{z}}=\frac{1}{1+e^{-z}}
    $$
  </div>
</details>

This is the sigmoid function of $z=\mathbf{w}^\top\mathbf{x}+b$. It squashes any score into a probability between 0 and 1. A score of 0 gives exactly 0.5, which is the decision boundary we found above. Large positive scores push the probability towards 1 (spam), and large negative scores push it towards 0 (not spam).

<figure class="concept-diagram sigmoid-diagram">
  <svg viewBox="0 0 640 300" role="img" aria-label="The sigmoid curve" aria-describedby="sigmoid-desc">
    <desc id="sigmoid-desc">An S-shaped curve rises from 0 to 1 as the score z increases, passing through 0.5 at z equals 0.</desc>
    <path d="M70 250H610" />
    <path d="M340 262V30" />
    <path d="M346 50H600" stroke-dasharray="4 6" />
    <path d="M346 150H600" stroke-dasharray="4 6" />
    <path class="constraint" d="M80.0 249.5 L90.8 249.4 L101.7 249.2 L112.5 249.0 L123.3 248.7 L134.2 248.3 L145.0 247.8 L155.8 247.2 L166.7 246.4 L177.5 245.4 L188.3 244.1 L199.2 242.5 L210.0 240.5 L220.8 238.0 L231.7 234.8 L242.5 230.9 L253.3 226.2 L264.2 220.4 L275.0 213.5 L285.8 205.5 L296.7 196.2 L307.5 185.8 L318.3 174.5 L329.2 162.4 L340.0 150.0 L350.8 137.6 L361.7 125.5 L372.5 114.2 L383.3 103.8 L394.2 94.5 L405.0 86.5 L415.8 79.6 L426.7 73.8 L437.5 69.1 L448.3 65.2 L459.2 62.0 L470.0 59.5 L480.8 57.5 L491.7 55.9 L502.5 54.6 L513.3 53.6 L524.2 52.8 L535.0 52.2 L545.8 51.7 L556.7 51.3 L567.5 51.0 L578.3 50.8 L589.2 50.6 L600.0 50.5" />
    <circle cx="340" cy="150" r="7" />
    <text x="328" y="56" text-anchor="end">1</text>
    <text x="328" y="145" text-anchor="end">0.5</text>
    <text x="328" y="244" text-anchor="end">0</text>
    <text class="contour-label" x="600" y="284" text-anchor="end">z = wᵀx + b</text>
    <text class="contour-label" x="352" y="284">z = 0</text>
    <text class="constraint-label" x="420" y="38">P(y = +1 | x)</text>
  </svg>
  <figcaption>At $z=0$, the email sits exactly on the decision boundary, so both classes are equally likely.</figcaption>
</figure>

Because $y\in\lbrace+1,-1\rbrace$, we can write both cases in one formula:

$$
P(y\mid\mathbf{x})=\frac{1}{1+e^{-y(\mathbf{w}^\top\mathbf{x}+b)}}
$$

For $y=-1$, this gives:

$$
P(y=-1\mid\mathbf{x})=\frac{1}{1+e^{\mathbf{w}^\top\mathbf{x}+b}}
$$

which is exactly $1-P(y=+1\mid\mathbf{x})$.

