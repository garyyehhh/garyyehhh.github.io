---
title: "Naive Bayes: Three Ways to Model Features"
date: 2026-08-05
updated: 2026-08-05
course: "Cornell CS4780"
status: "Draft"
published: false
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
summary: "A temporary working draft on how categorical, multinomial, and continuous features lead to different Naive Bayes models."
thinking_excerpt: "The classifier stays the same. What changes is the story I tell about how the features arise."
---

When I first came across Naive Bayes, I understood the broad idea: use Bayes' rule to compare classes. I did not yet understand why there were several versions of the method, or what actually changes between them.

This is a temporary draft for working through that question. I want to understand three cases:

1. Categorical features.
2. Multinomial features, especially word counts.
3. Continuous features, using Gaussian Naive Bayes.

My current guess is that the classifier itself does not fundamentally change. The main change is the probability model I use for the features.

## The question Naive Bayes is trying to answer

Suppose I observe a feature vector $x$ and want to predict its class $y$. The question is:

> Which class would make these features most plausible?

Bayes' rule gives me:

$$
p(y=c\mid x)
=
\frac{p(x\mid y=c)p(y=c)}{p(x)}
$$

When I compare classes, $p(x)$ is the same for every candidate class. I can therefore classify using:

$$
\hat y
=
\arg\max_c
p(x\mid y=c)p(y=c)
$$

The two pieces have different roles:

- $p(y=c)$ is the prior probability of class $c$.
- $p(x\mid y=c)$ is how plausible the observed features are under class $c$.

The basic pipeline is:

> feature representation $\longrightarrow$ class-conditional likelihood $\longrightarrow$ class score $\longrightarrow$ prediction

## The naive assumption

The feature vector may contain several components:

$$
x=(x_1,x_2,\ldots,x_d)
$$

Naive Bayes makes the simplifying assumption that the features are conditionally independent once the class is known:

$$
p(x\mid y=c)
=
\prod_{j=1}^{d}p(x_j\mid y=c)
$$

This does not mean that the features are independent everywhere. It means that, after I know the class, I ignore the remaining dependence between them.

That assumption may be visibly false. For example, the words "free" and "prize" may appear together more often than chance would suggest. Naive Bayes still treats their contributions separately after conditioning on whether the message is spam.

> **Placeholder for my intuition:** Why can a model still classify well when its probability assumptions are only approximately true?

For numerical stability, I can work with log-scores instead of multiplying many small probabilities:

$$
\log p(y=c)
+
\sum_{j=1}^{d}\log p(x_j\mid y=c)
$$

The predicted class is still the class with the largest score.

## One classifier, three likelihood models

The decision rule stays fixed. I change the likelihood model according to the way my features are represented.

| Variant | What each feature represents | Likelihood model | Example |
| --- | --- | --- | --- |
| Categorical Naive Bayes | One value from a finite set | Category probabilities | Colour, browser, device type |
| Multinomial Naive Bayes | A count of events | Count-based categorical probabilities | Word counts in a document |
| Gaussian Naive Bayes | A real-valued measurement | A normal density | Height, temperature, sensor value |

This is the distinction I want to keep in view while writing the rest of the note:

> The Naive Bayes machinery is shared. The feature likelihood tells me which version I am using.

## Categorical Naive Bayes

### What kind of data is this?

Categorical features take values from a finite set of named categories.

Examples might include:

- colour: red, blue, or green
- device: mobile, tablet, or desktop
- browser: Safari, Chrome, or Firefox

For one feature $x_j$, I estimate the probability of each category within each class:

$$
p(x_j=v\mid y=c)
$$

The full class score is then:

$$
p(y=c)\prod_{j=1}^{d}p(x_j=v_j\mid y=c)
$$

### Estimating the categories

The simplest estimate comes from counts:

$$
p(x_j=v\mid y=c)
=
\frac{N_{jvc}}{N_{jc}}
$$

where $N_{jvc}$ counts observations with feature value $v$ in class $c$, and $N_{jc}$ counts observations in class $c$ for that feature.

This estimate can become zero when a category has not appeared in a class. Since Naive Bayes multiplies feature probabilities, one zero can erase the entire score for that class.

A smoothed estimate is:

$$
p(x_j=v\mid y=c)
=
\frac{N_{jvc}+\alpha}{N_{jc}+\alpha K_j}
$$

where $K_j$ is the number of possible values for feature $j$.

> **Placeholder:** Add a tiny table showing how the same category counts lead to different class scores.

### My current interpretation

Categorical Naive Bayes is appropriate when the feature value is a label rather than a number whose distance from another value has meaning.

For example, "Chrome" is not twice as much browser as "Safari." The model should count category frequencies rather than pretend the categories lie on a meaningful numerical scale.

## Multinomial Naive Bayes

### What changes here?

Multinomial Naive Bayes is useful when the features represent counts of events. The classic example is text classification.

For a document, I can represent the input as:

$$
x=(x_1,x_2,\ldots,x_V)
$$

where $x_j$ is the number of times vocabulary item $j$ appears in the document.

The order of the words is ignored. This is the bag-of-words representation.

The class-conditional score has the form:

$$
p(x\mid y=c)
\propto
\prod_{j=1}^{V}\phi_{jc}^{x_j}
$$

where $\phi_{jc}$ is the probability of vocabulary item $j$ under class $c$.

Taking logs turns the product into a weighted sum:

$$
\log p(x\mid y=c)
=
\sum_{j=1}^{V}x_j\log\phi_{jc}
$$

The count $x_j$ acts like a weight. A word that appears several times contributes several times to the class score.

### A common point of confusion

"Multinomial" does not mean that there are multiple classes. It describes the count-based representation of the observations.

The model may have two classes, ten classes, or more. The important part is that the input records how many times each event occurred.

For a vocabulary of size $V$, a smoothed token estimate can be written as:

$$
\phi_{jc}
=
\frac{N_{jc}+\alpha}{N_c+\alpha V}
$$

where $N_{jc}$ is the count of word $j$ in class $c$, and $N_c$ is the total number of observed tokens in that class.

> **Placeholder:** Work through a two-class example with a very small vocabulary. Show how one word changes the relative class scores.

## Gaussian Naive Bayes

### When the features are continuous

Sometimes a feature is a real-valued measurement rather than a category or a count. Examples include:

- height and weight
- temperature and pressure
- measurements from a sensor
- numerical features extracted from an image

Gaussian Naive Bayes models each feature within each class using a normal distribution:

$$
p(x_j\mid y=c)
=
\mathcal N(x_j;\mu_{jc},\sigma_{jc}^{2})
$$

The parameters $\mu_{jc}$ and $\sigma_{jc}^{2}$ are estimated separately for each feature and each class.

The log-score contains the Gaussian log-density for each feature:

$$
\log p(y=c)
+
\sum_{j=1}^{d}
\log\mathcal N(x_j;\mu_{jc},\sigma_{jc}^{2})
$$

The model is still making the same conditional-independence assumption. It has simply chosen a different likelihood for each continuous feature.

### What Gaussian means here

Continuous features do not automatically require Gaussian Naive Bayes. Gaussianity is an additional modelling assumption:

> Within each class, each feature is approximately normally distributed.

If that assumption is poor, the estimated class scores may also be poor. I want to check later how sensitive the classifier is to skewed or multi-modal features.

> **Placeholder:** Add a small numerical example with two classes and one continuous feature. Compare the Gaussian densities before calculating the final class scores.

## Comparing the three cases

The prediction rule is unchanged:

$$
\hat y
=
\arg\max_c
\left[
\log p(y=c)
+
\log p(x\mid y=c)
\right]
$$

What changes is the second term:

- Categorical Naive Bayes counts named category values.
- Multinomial Naive Bayes scores event counts, such as word occurrences.
- Gaussian Naive Bayes evaluates continuous values under class-specific normal densities.

This now feels like a more useful way to organize the topic. I am not memorizing three unrelated algorithms. I am choosing a likelihood that matches the way my data is represented.

## Smoothing, priors, and the zero-probability problem

Smoothing matters most when a feature value has not appeared in the training data for a class.

Without smoothing:

$$
p(x_j=v\mid y=c)=0
$$

With a product model, that single zero can make the entire class-conditional likelihood zero.

This connects back to my [MLE and MAP note]({{ '/notes/mle-map-probabilistic-classification/' | relative_url }}). An unsmoothed count is an MLE-style estimate. A smoothed estimate can be understood through a prior, depending on the exact estimator and interpretation I choose.

> **Placeholder:** Explain the difference between Laplace smoothing, a general Dirichlet prior, posterior mean, and MAP. Keep this short so the note does not become a second MLE/MAP derivation.

## Boundaries I do not want to blur

There are a few nearby ideas that I should keep separate while writing:

- Binary presence or absence features are often handled with Bernoulli Naive Bayes rather than Multinomial Naive Bayes.
- Multinomial Naive Bayes uses counts, not simply "many categories."
- Gaussian Naive Bayes uses continuous values, but only assumes they are Gaussian within each class.
- The class prior $p(y)$ is different from a parameter prior such as $p(\theta)$ in MAP estimation.
- A good classifier does not necessarily provide perfectly calibrated probabilities.

## What I still need to understand

> **Draft prompts for later:**

- Why can the conditional-independence assumption still produce useful decision boundaries?
- When does Multinomial Naive Bayes outperform logistic regression for text?
- How does Gaussian Naive Bayes behave when features are strongly correlated?
- What is the practical effect of smoothing on a small dataset?
- How should I choose between a generative model and a discriminative model?

## Closing reflection

The current idea I want to keep from this note is:

> Naive Bayes is one classification recipe with several possible stories about how the features were generated.

Categorical, multinomial, and Gaussian Naive Bayes share the same Bayes decision structure. They differ in the likelihood model I use to describe the data within each class.

> **Placeholder for my final reflection:** Connect this back to MLE, MAP, and the broader question of how probability assumptions become machine-learning models.
