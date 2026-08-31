

# **Certified** **Tester** **AI** **Testing** **Syllabus**

Version 2.0

International Software Testing Qualifications Board

## Provided by

Alliance for Qualification, Artificial Intelligence United, Chinese Software Testing Qualifications Board, and Korean Software Testing Qualifications Board

Copyright Notice © International Software Testing Qualifications Board (hereinafter called ISTQB®) ISTQB® is a registered trademark of the International Software Testing Qualifications Board.

Copyright © 2026, the authors Klaudia Dussa-Zieger (chair), Stuart Reid, Vipul Kocher, Qin Liu, Jarosław Hryszko, Kyle Alexander Siemens, and Werner Henschelchen.

Copyright © 2021, the authors Klaudia Dussa-Zieger (chair), Vipul Kocher, Qin Liu, Stuart Reid, Kyle Alexander Siemens, Werner Henschelchen, and Adam Leon Smith.

All rights reserved. The authors hereby transfer the copyright to the ISTQB®. The authors (as current copyright holders) and ISTQB® (as the future copyright holder) have agreed to the following conditions of use:

* Extracts, for non-commercial use, from this document may be copied if the source is acknowledged. Any Accredited Training Provider may use this syllabus as the basis for a training course if the authors and the ISTQB® are acknowledged as the source and copyright owners of the syllabus, and provided that any advertisement of such a training course may mention the syllabus only after official Accreditation of the training materials has been received from an ISTQB®\-recognized Member Board.

* Any individual or group of individuals may use this syllabus as the basis for articles and books, if the authors and the ISTQB® are acknowledged as the source and copyright owners of the syllabus.

* Any other use of this syllabus is prohibited without first obtaining the approval in writing of the ISTQB®.

* Any ISTQB®\-recognized Member Board may translate this syllabus, provided they reproduce the above-mentioned Copyright Notice in the translated version of the syllabus.

| Version | Date | Remarks |
| :---- | :---- | :---- |
| 1.0 | 2021/10/01 | Release for GA |
| 2.0 Alpha | 2025/08/15 | Alpha review |
| 2.0 Beta | 2026/01/07 | Beta review |
| 2.0 | 2026/04/17 | Release for GA |
|  |  |  |

Copyright Notice	2

Revision History	3

Table of Contents	4

Acknowledgements	8

0. Introduction	9

>    1. Purpose of this Syllabus	9

>    2. The Certified Tester AI Testing	9

>    3. Career Path for Testers	9

>    4. Business Outcomes	9

>    5. Learning Objectives, Hands-on Objectives and Cognitive Level of Knowledge	10

>    6. The Certified Tester AI Testing Certificate Exam	10

>    7. Accreditation	11

>    8. Handling of Standards	11

>    9. Level of Detail	11

>    10. How this Syllabus is Organized	12

1. Introduction to Artificial Intelligence – 120 minutes	14

>    1. [Introduction to AI	15](#introduction-to-ai)

      1. [AI-Based and Conventional Systems	15](#ai-based-and-conventional-systems)

      2. [Narrow AI, General AI, and Super AI	15](#narrow-ai,-general-ai,-and-super-ai)

      3. [Different Types of AI Technologies	16](#different-types-of-ai-technologies)

      4. [Generative AI	17](#generative-ai)

      5. [Hardware for Machine Learning Systems	18](#hardware-for-machine-learning-systems)

      6. [Development and Hosting of AI Models	18](#development-and-hosting-of-ai-models)

      7. [Machine Learning Development Frameworks	19](#machine-learning-development-frameworks)

      8. [Regulations and Standards for AI	20](#regulations-and-standards-for-ai)

2. Quality Characteristics for AI-Based Systems – 45 minutes	21

>    1. [Quality Characteristics for AI-Based Systems	22](#quality-characteristics-for-ai-based-systems)

      1. [AI-Specific Quality Characteristics	22](#ai-specific-quality-characteristics)

      2. [AI and Safety	23](#ai-and-safety)

>    2. Acceptance Criteria for AI-Based Systems	23

      1. [Acceptance Criteria for AI-Based Systems	24](#acceptance-criteria-for-ai-based-systems)

3. Machine Learning – 375 minutes	26

>    1. [Introduction to Machine Learning	27](#introduction-to-machine-learning)

      1. [Different Forms of Machine Learning	27](#different-forms-of-machine-learning)

      2. [Machine Learning Workflow	28](#machine-learning-workflow)

      3. [Hands-on Exercise: Create a Machine Learning Model	30](#hands-on-exercise:-create-a-machine-learning-model)

      4. [Pretrained Models, Fine-Tuning, and Retrieval-Augmented Generation	30](#pretrained-models,-fine-tuning,-and-retrieval-augmented-generation)

>    2. Data for Machine Learning	31

      1. [Activities in Data Preparation	31](#activities-in-data-preparation)

      2. [Hands-on Exercise: Data Preparation in Support of the Creation of a Machine Learning Model		33](#hands-on-exercise:-data-preparation-in-support-of-the-creation-of-a-machine-learning-model)

>    3. ML Functional Performance Metrics for Classification	33

      1. [Calculation of Machine Learning Functional Performance Metrics	33](#calculation-of-machine-learning-functional-performance-metrics)

      2. [Hands-on Exercise: Evaluate a Machine Learning Model using Selected ML Functional Performance Metrics	34](#hands-on-exercise:-evaluate-a-machine-learning-model-using-selected-ml-functional-performance-metrics)

      3. [Hands-on Exercise: Show the Impact of Different Machine Learning Models and Dataset Combinations	35](#hands-on-exercise:-show-the-impact-of-different-machine-learning-models-and-dataset-combinations)

>    4. Neural Networks	35

      1. [Structure and Working of a Deep Neural Network	36](#structure-and-working-of-a-deep-neural-network)

      2. [Hands-on Exercise: Experience the Implementation of a Perceptron	37](#hands-on-exercise:-experience-the-implementation-of-a-perceptron)

      3. [Coverage Measures for Neural Networks	37](#coverage-measures-for-neural-networks)

4. Testing AI-Based Systems – 195 minutes	38

>    1. [Introduction to Testing AI-Based Systems	39](#introduction-to-testing-ai-based-systems)

      1. [Locked and Adaptive AI-Based Systems	39](#locked-and-adaptive-ai-based-systems)

      2. [Rationale for a Statistical Approach to Testing AI-Based Systems	40](#rationale-for-a-statistical-approach-to-testing-ai-based-systems)

      3. [Test Oracles for AI-Based Systems	40](#test-oracles-for-ai-based-systems)

>    2. Testing Generative AI and Large Language Models	41

      1. [Testing Generative AI	41](#testing-generative-ai)

      2. [Red Teaming	42](#red-teaming)

      3. [Hands-on Exercise: Exploratory Testing of a Large Language Model	43](#hands-on-exercise:-exploratory-testing-of-a-large-language-model)

>    3. Test Levels and Machine Learning Systems	43

      1. [Test Levels for Machine Learning Systems	43](#test-levels-for-machine-learning-systems)

      2. [Risk-Based Testing of Machine Learning Systems	44](#risk-based-testing-of-machine-learning-systems)

5. Input Data Testing for Machine Learning Systems – 180 minutes	46

>    1. [Input Data Testing for Machine Learning Systems	47](#input-data-testing-for-machine-learning-systems)

      1. [Input Data Risks and Mitigations	47](#input-data-risks-and-mitigations)

      2. [Testing for Bias	48](#testing-for-bias)

      3. [Data Pipeline Testing	49](#data-pipeline-testing)

      4. [Testing for Data Representativeness	50](#testing-for-data-representativeness)

      5. [Dataset Constraint Testing	51](#dataset-constraint-testing)

      6. [Label Correctness Testing	52](#label-correctness-testing)

      7. [Hands-on Exercise: Input Data Testing	53](#hands-on-exercise:-input-data-testing)

6. Model Testing for Machine Learning Systems – 225 minutes	54

>    1. [Model Testing for Machine Learning Systems	55](#model-testing-for-machine-learning-systems)

      1. [Machine Learning Model Risks and Mitigations	55](#machine-learning-model-risks-and-mitigations)

      2. [Machine Learning Model Documentation and Review	56](#machine-learning-model-documentation-and-review)

      3. [ML Functional Performance Testing of Probabilistic Machine Learning Systems	57](#ml-functional-performance-testing-of-probabilistic-machine-learning-systems)

      4. [Adversarial Testing of Machine Learning Systems	58](#adversarial-testing-of-machine-learning-systems)

      5. [Metamorphic Testing	59](#metamorphic-testing)

      6. [Hands-on Exercise: Apply Metamorphic Testing	60](#hands-on-exercise:-apply-metamorphic-testing)

      7. [Drift Testing	60](#drift-testing)

      8. [Testing for Overfitting and Underfitting	60](#testing-for-overfitting-and-underfitting)

      9. [A/B Testing	61](#a/b-testing)

      10. [Back-to-Back Testing	62](#back-to-back-testing)

7. Machine Learning Development Testing – 30 minutes	63

>    1. [Machine Learning Development Testing	64](#machine-learning-development-testing)

      1. [Machine Learning Development Risks and Mitigations	64](#machine-learning-development-risks-and-mitigations)

      2. [Machine Learning System Deployment Testing	65](#machine-learning-system-deployment-testing)

8. List of Abbreviations	67

9. AI-Specific Terms	69

10. References	78

>     1. Standards	78

>     2. ISTQB® Documents	78

>     3. Glossary References	78

>     4. Books, Articles and Web Pages	79

11. Trademarks	80

12. Appendix A – Learning Objectives/Cognitive Level of Knowledge	81

> [Level 1: Remember (K1)	81](#level-1:-remember-\(k1\))

> [Level 2: Understand (K2)	81](#level-2:-understand-\(k2\))

> [Level 3: Apply (K3)	82](#level-3:-apply-\(k3\))

> [Level 4: Analyze (K4)	82](#level-4:-analyze-\(k4\))

13. Appendix B – Business Outcomes Traceability Matrix with Learning Objectives	83

14. Appendix C – Release Notes	91

15. Index	92

The General Assembly of the ISTQB® formally released this document on April 17th, 2026\.

ISTQB taskforce AI (v2.0): Klaudia Dussa-Zieger (chair), Stuart Reid, Vipul Kocher, Qin Liu, Jaroslaw Hryszko, Kyle Alexander Siemens, and Werner Henschelchen

The following persons participated in reviewing and commenting on the syllabus: Marina Abratis, Tom Adams, Laura Albert, Abhishek Alladi, Menno van den Berg, Earl Burba, Simeone Chiumarulo, Marco Ciarlitto, Alessandro Collino, Jean-Baptiste Crouigneau, Yara Dalgamoni, Taz Daughtrey, Wim Decoutere, Dmitrii Degtiarenko, Iuliia Emelianova, Lozana Enbah, Tamás Gergely, David Hendrickx, David Janota, Sagar Joshi, Norbert Juhász, Willem Keesman, John Kurowski, Ine Lutterman, Niranjan Maharajh, Rik Marselis, Judy McKay, Gary Mogyorodi, Markus Niehammer, Tauhida Parveen, Arnd Pehl, Lukas Piska, Daniel Polan, Andrew Pollner, Nishan Portoyan, Meile Posthuma, Miroslav Renda, Randall Rice, Piet de Roo, Nicola de Rosa, Mark Rutz, Salvatore Sarno, Klaus Skafte, Giancarlo Tomasig, Yaron Tsubery, Rahul Verma, André Verschelling, Linda Vreeswijk, Mario Winter

ISTQB taskforce AI (v1.0): Klaudia Dussa-Zieger (chair), Vipul Kocher, Qin Liu, Stuart Reid, Adam Leon Smith, Kyle Alexander Siemens, and Werner Henschelchen

The team thanks the authors of the three contributing syllabi:

* A4Q: Rex Black, Bruno Legeard, Jeremias Rößler, Adam Leon Smith, Stephan Goericke, Werner Henschelchen

* AiU: Main authors Vipul Kocher, Saurabh Bansal, Srinivas Padmanabhuni, and Sonika Bengani and co-authors Rik Marselis, José M. Diaz Delgado

* CSTQB/KSTQB: Qin Liu, Stuart Reid

The team thanks the Exam, Glossary, and Marketing Working Groups for their support throughout syllabus development, and the Member Boards for their suggestions and input.

This syllabus forms the basis for the ISTQB® Certified Tester AI Testing. The ISTQB® provides this syllabus as follows:

* To member boards, to translate into their local language and to accredit training providers. Member boards may adapt the syllabus to their specific language needs and modify the references to align with their local publications.

* To certification bodies, to derive examination questions in their local language, adapted to the learning objectives for this syllabus.

* To training providers, to produce courseware and determine appropriate teaching methods.

* To certification candidates, to prepare for the certification exam (either as part of a training course or independently).

* To the international software and systems engineering community, to advance the profession of software and systems testing, and as a basis for books and articles.

The Certified Tester AI Testing (CT-AI) is designed for individuals involved in testing AI-based systems. This includes individuals in various roles, such as testers, test analysts, data analysts, test engineers, test consultants, test managers, user acceptance testers, and software developers. This certification is also suitable for individuals seeking a fundamental understanding of testing AI-based systems, including project managers, quality managers, software development managers, business analysts, operations team members, IT directors, and management consultants.

The ISTQB® scheme provides support for testing professionals at all stages of their careers. Individuals who achieve the ISTQB® Certified Tester Foundation Level certification may also be interested in the Core Advanced Levels (Test Analyst, Technical Test Analyst, and Test Manager) and, thereafter, the Expert Level (Test Management or Improving the Test Process). The Specialist stream offers a deep dive into specific test approaches and activities, e.g., Agile Testing, Test Automation, AI Testing, Testing with Generative AI, or Mobile App Testing, or into group testing know-how for certain industry domains, e.g., Automotive or Gaming. Please visit [www.istqb.org](https://eur01.safelinks.protection.outlook.com/?url=http%3A%2F%2Fwww.istqb.org%2F&data=05%7C01%7Cfilipe.carlos%40innowave.tech%7Cb1ee83ff6521424c792908da440ce915%7C726174dc30ab40e185fc60cda0e0bd81%7C0%7C0%7C637897119663377885%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=Sgv6mR7KzlIIQ6MFZ0cBRVv6yEoTekNJEqwFQ7M%2Bx7M%3D&reserved=0) for the latest information on ISTQB´s Certified Tester Scheme.

This section lists the Business Outcomes expected of a candidate who has achieved the CT-AI certification.

A Certified Tester in AI Testing can:

| BO1 | Understand the current state of AI, including generative AI. |
| :---- | :---- |
| BO2 | Experience the implementation and testing of machine learning models. |
| BO3 | Understand the working and testing of simple neural networks. |
| BO4 | Understand the specific AI quality characteristics defined by ISO/IEC 25059\. |
| BO5 | Calculate and interpret ML functional performance metrics for machine learning models. |
| BO6 | Recognize the scope and importance of the two test levels that are specific to the testing of machine learning systems. |
| BO7 | Contribute to the development of an effective test strategy for a machine learning system. |
| BO8 | Design and execute test cases for machine learning systems. |

Learning Objectives (LO) support the business outcomes and are used to create the CT-AI exams. The specific learning objectives levels are shown at the beginning of each chapter, and classified as follows:

* K1: Remember

* K2: Understand

* K3: Apply

* K4: Analyze

Further details and examples of learning objectives are given in Appendix A.  
For all terms listed as keywords just below chapter headings, the correct name and definition from the ISTQB® glossary or Chapter 9 shall be remembered (K1), even if not explicitly mentioned in the learning objective.

Hands-on Objectives (HO) focus on the practical application of the Learning Objectives and are shown at the beginning of each chapter. The level of a HO is classified as follows:

* H0: This can include a live demo of an exercise or a recorded video. Since the trainee does not perform this, it is not strictly an exercise.

* H1: Guided exercise. The trainees follow a sequence of steps performed by the trainer.  
* H2: Exercise with hints. The trainee is given an exercise with relevant hints to enable the exercise to be solved within the given timeframe.

The CT-AI exam will be based on the Learning Objectives described in this syllabus. All syllabus sections are examinable except for the Introduction, Hands-On Objectives, References, and Appendices.

Answering exam questions may require using material based on more than one section of this syllabus. Standards and books are included as references, but their content is not examinable beyond what is summarized in the syllabus itself.

Refer to the Exam Structures and Rules document for the CT-AI v2.0 for further details.

The main entry criterion for anyone interested in taking the CT-AI exam is holding the ISTQB® Certified Tester Foundation Level \[CTFL\] certificate.

It is strongly recommended that candidates also:

* Have a minimal background in either software development or software testing, such as six months of experience as a system or user acceptance tester, data scientist, or software developer.

* Take a course accredited to ISTQB® standards (by one of the ISTQB-recognized member boards).

An ISTQB® Member Board may accredit training providers whose course material follows this syllabus. Training providers should obtain accreditation guidelines from the Member Board or body that performs the accreditation. An accredited course is recognized as conforming to this syllabus and allows an ISTQB® exam to be included in the course.

The accreditation guidelines for this syllabus follow the general Accreditation Guidelines published by the Processes Management and Compliance Working Group.

International standardization organizations like IEEE and ISO have issued standards associated with quality characteristics and software testing. The purpose of these references is to provide a framework (as in the references to ISO/IEC 25059 and ISO/IEC 25010 regarding a quality model for AI-based systems) or to provide a source of additional information if desired by the reader. Please note that syllabi are using the standard documents as a reference. Standards documents are not intended for examination.

The level of detail in this syllabus allows internationally consistent courses and exams. To achieve this goal, the syllabus consists of:

* General instructional objectives describing the intention of the CT-AI syllabus

* A list of keywords that students must be able to recall

* Learning objectives for each knowledge area, describing the cognitive learning outcome to be achieved

* A description of the key concepts, including references to sources such as accepted literature or standards

The syllabus content does not describe the entire knowledge area of software testing; it reflects the level of detail to be covered in CT-AI training courses. It focuses on introducing the basic concepts of AI and machine learning (ML) in particular, and how systems based on these technologies can be tested.

The syllabus uses the terminology (i.e., the name and meaning) of the terms used in software testing and quality assurance according to the ISTQB® Glossary.

There are seven chapters with examinable content. The top-level heading for each chapter specifies the chapter duration; timing is not provided at the chapter level. *For* *accredited* *training* *courses,* *the* *syllabus* *requires* *a* *minimum* *of* 19.5 hours of instruction, distributed across the seven chapters as follows:

* Chapter 1: 120 minutes \- Introduction to Artificial Intelligence (AI)

  * Understand the key differences between AI-based systems and conventional systems, and explore the spectrum of AI capabilities, ranging from narrow AI to super AI.

  * Gain a foundational understanding of AI technologies, including generative AI (GenAI), and the hardware, hosting, and development frameworks used to implement machine learning systems (MLS).

  * Learn how regulations and standards influence the development and testing of AI-based solutions.

* Chapter 2: 45 minutes \- Quality Characteristics for AI-Based Systems

  * Learn about quality characteristics specific to AI-based systems, including those defined in ISO/IEC 25059, and understand safety-related considerations when using AI in critical systems.

  * Explore how to define appropriate acceptance criteria tailored to the unique behavior and performance of AI-based solutions.

* Chapter 3: 375 minutes \- Machine Learning

  * Understand the types of ML, key steps in the ML development workflow, and how pretrained models, fine-tuning, and retrieval-augmented generation contribute to modern AI-based systems.

  * Learn about data preparation, the roles of training, validation, and test datasets, and how these influence ML model development and performance.

  * Explore neural networks, including their structure and coverage measures, and gain hands-on experience with performance metrics and using a confusion matrix.

* Chapter 4: 195 minutes \- Testing AI-Based Systems

  * Understand the unique testing challenges of AI-based systems, including differences in testability between locked and adaptive systems, the need for statistical testing, and the difficulties of defining test oracles.

  * Learn how to test GenAI and large language models (LLM), using techniques such as red teaming and exploratory testing for AI performing test tasks.

  * Explore test strategies for MLS, covering various test levels and the application of risk-based testing.

* Chapter 5: 180 minutes \- Input Data Testing for Machine Learning Systems

* Learn how to test and validate input data for MLS, including techniques for detecting bias, verifying label correctness, assessing data representativeness, and testing the data pipeline.

* Chapter 6: 225 minutes \- Model Testing for Machine Learning Systems

  * Discover test approaches for mitigating risks in ML models, including documentation reviews, ML functional performance testing, and detecting overfitting, underfitting, and drift.

  * Learn advanced test approaches, including adversarial testing, A/B testing, back-to-back testing, and the use of attacks to uncover model weaknesses.

  * Gain hands-on understanding of metamorphic testing, including how to derive and apply test cases where traditional test oracles are insufficient.

* Chapter 7: 30 minutes \- Machine Learning Development Testing

  * Learn test approaches and test strategies for mitigating risks during MLS development and deployment, to support robust system behavior in production environments.

### **Keywords**

None

### **AI-Specific** **Keywords**

AI-based system, artificial intelligence, general AI, machine learning, ML development framework, narrow AI, super AI

### **Learning** **Objectives** **for** **Chapter** **1:**

1. ### **Introduction** **to** **AI**

AI-1.1.1 (K2) Differentiate between AI-based systems and conventional systems AI-1.1.2 (K2) Distinguish between narrow AI, general AI, and super AI

AI-1.1.3 (K2) Explain the different types of AI technologies AI-1.1.4 (K2) Explain generative AI

AI-1.1.5 (K2) Compare the choices available for hardware to implement machine learning systems AI-1.1.6 (K2) Compare the options for the development and hosting of AI models

AI-1.1.7 (K2) Summarize the functionality provided by ML development frameworks

AI-1.1.8 (K2) Explain how regulations and standards affect the development and testing of AI-based systems

This chapter introduces key distinctions between conventional and AI-based systems, focusing on their design approaches, adaptability, and explainability. It describes the spectrum of AI capabilities, ranging from narrow AI to general AI and super AI, and outlines core technologies such as ML, deep learning, and GenAI. The chapter describes common hardware and development environments for AI-based systems, as well as popular ML frameworks. Finally, it considers essential regulatory and technical standards that guide responsible AI development and deployment within various domains.

1. ## AI-Based and Conventional Systems

Conventional computer systems are typically programmed using imperative languages, where human developers explicitly define step-by-step instructions, including constructs such as if-then-else statements and loops. This deterministic approach helps make the system's behavior predictable and transparent, making it easier for humans to understand how inputs produce different outputs. In contrast, most AI-based systems, particularly those leveraging ML, do not follow predefined rules. Instead, they analyze patterns in the data to determine how to respond to new inputs. For example, an AI-based image recognition system trained to identify cats does not rely on explicitly coded rules. Instead, it learns from a dataset of cat images, extracting patterns that it later applies to unseen images to classify them accurately.

One fundamental difference between conventional and AI-based systems is how they approach problem-solving. Many AI-based systems rely on probabilistic reasoning, statistical inference, and pattern recognition to generate results. This allows AI models to handle complex forms of uncertainty and ambiguity more effectively, resulting in outputs that are not always predictable.

A key challenge in AI-based systems is explainability. Many AI models, particularly deep learning architectures, can contain billions of parameters, making their internal workings difficult for humans to interpret. This “black-box” nature raises concerns in critical domains such as healthcare, finance, defence, and transportation, where understanding why an AI model made a particular decision is crucial. Achieving transparency (see 2.1.1) and explainability in AI-driven decision-making has become a critical focus in AI regulation.

Another significant distinction is adaptability. Conventional systems are static and typically require manual updates to incorporate new knowledge or respond to environmental changes. AI-based systems, in contrast, can be self-learning, continuously improving their performance as they encounter new data. This adaptability makes AI particularly powerful in dynamic environments. Adaptability also requires continuous monitoring to maintain ongoing alignment with core requirements.

2. ## Narrow AI, General AI, and Super AI

Narrow AI, also known as weak AI, is designed to perform specific tasks and represents all deployed AI systems in use today. Narrow AI-based systems operate within a limited domain and can be highly efficient at solving specialized problems, such as image recognition, speech processing, and language translation. However, they lack the ability to generalize beyond the functions they have learned. For instance, an AI-based system that excels at recognizing faces cannot perform language translation unless it is explicitly retrained to do so. Frontier AI, a subset of narrow AI, represents the most advanced form of these systems, pushing the boundaries of current capabilities with GenAI models. Frontier AI includes large-scale systems with highly autonomous decision-making capabilities; however, they remain task-specific and have not yet achieved the versatility of general AI.

General AI, also known as strong AI, refers to an AI-based system that possesses the ability to perform most intellectual tasks that a human can. General AI would be able to understand, learn, and apply knowledge across a broad range of tasks without needing to be retrained for each new task. This type of AI would exhibit human-like reasoning and adaptability, capable of solving unfamiliar problems in various domains, much like humans do. Despite significant progress in AI, no AI-based system today possesses general intelligence.

Super AI (artificial superintelligence) is the form of AI in which an AI-based system continuously improves itself without the need for human intervention or control. For Super AI to be possible, access to the Internet is not strictly required, but such access could significantly expand its capabilities and influence. It would surpass human intelligence and general AI, which many believe would pose an existential risk to humanity. The point at which AI-based systems transition from general AI to super AI, if it were to occur, is commonly known as the technological singularity.

3. ## Different Types of AI Technologies

Artificial Intelligence encompasses a range of technologies, each suited to specific tasks and challenges. One of the core branches of AI is ML, which enables systems to learn from data and build models without explicit programming. While some MLS can adapt and improve continuously with new data throughout their lifetimes, others operate on the knowledge they initially learned and require explicit retraining to update their capabilities. ML includes several approaches:

* Supervised learning utilizes labeled data and algorithms, such as linear regression and decision trees, for tasks like prediction and classification.

  * Unsupervised learning uncovers patterns in unlabeled data through techniques like clustering (using clustering algorithms).

    * Reinforcement learning enables intelligent agents to learn optimal behaviors through trial-and-error interactions with their environment.

Key ML technologies include neural networks, Bayesian models, support vector machines (SVM) and random forests. See Chapter [3](#heading=h.5n3kgze7wsbb) for more on ML.

Deep Learning (DL), a subset of ML methods, uses deep neural networks to solve complex problems. For example:

* Convolutional neural networks (CNN) are highly effective for image recognition and object detection.

  * Recurrent neural networks (RNN) specialize in processing sequential data, such as text or time series.

    * Transformers handle long-range dependencies in sequences, powering models for natural language processing and vision transformers for images.

GenAI builds on these technologies to create new content, including text, images, and audio (see 1.1.4). This is driven by models such as LLM, which combine deep neural networks (DNN) with natural language processing (NLP) to analyze and generate human-like language.

Other specialized AI technologies include:

* NLP for language analysis, including tasks like sentiment analysis and machine translation.

  * Computer vision for analyzing visual data, supporting applications like facial recognition and robotics.

    * Fuzzy logic for reasoning under uncertainty.

      * Search algorithms for solving optimization problems, such as navigation, and strategic decision-making.

      * Rule-based reasoning systems, or expert systems, for structured decision support.

Although the full integration of these AI technologies remains limited, new developments such as LLM demonstrate the potential to combine different AI technologies into unified, intelligent systems. Agentic AI extends these technologies through autonomous agents that plan, reason, and act independently to achieve goals in dynamic environments.

4. ## Generative AI

Generative AI (GenAI) refers to AI-based systems specialized in creating new content, such as text, images, video, music, or complex data, while many also support classification and prediction. These systems learn from vast amounts of data to produce outputs that resemble their training data, enabling a wide range of creative and practical applications.

The main technologies behind GenAI include generative adversarial networks (GANs), diffusion models, and transformers. GANs use two neural networks in competition to create highly realistic synthetic data. Diffusion models generate content by gradually adding and then removing noise from data, resulting in high-quality outputs. Transformer models, which underpin LLM, utilize self-attention mechanisms to generate coherent and contextually relevant text, and are increasingly being adapted for multimodal tasks.

Beyond their technical foundations, GenAI systems raise significant societal and ethical concerns. Misuse is a major concern: these models can be exploited to create deepfakes, spread misinformation, or generate convincing fraudulent content, thereby undermining trust in digital media and public discourse. The ease of producing synthetic content amplifies risks related to privacy, security, and manipulation, but it can bring notable benefits and opens opportunities for innovation in entertainment, marketing, education, and research.

The impact on employment is also notable, particularly among white-collar professions. As GenAI automates tasks such as writing, design, coding, and even legal or medical documentation, there is increasing debate about potential job displacement. While these technologies can boost productivity and foster new creative opportunities, they may also lead to workforce disruption and necessitate widespread reskilling.

Sustainability is another pressing issue. Training and running large GenAI models involve substantial computational resources, resulting in high energy consumption and a significant carbon footprint. This environmental impact has prompted calls for more efficient model designs and greener infrastructure.

Most practical GenAI tools today are based on foundation models, which are then fine-tuned for specific applications. The field is also advancing toward multimodal models capable of processing and generating content across text, images, and audio, enabling richer, more flexible AI-based systems. Regulatory frameworks, such as the EU AI Act \[EU AI Act\], are emerging to guide the responsible development and use of these technologies.

5. ## Hardware for Machine Learning Systems

A variety of hardware is used for MLS. Different types of hardware may be used for training and inference. For example, a speech recognition model may run on a low-end smartphone, although access to the power of cloud computing may be needed to train it.

ML typically benefits from hardware that supports the following:

* The ability to work with large data structures.

  * Massively parallel (concurrent) processing, for example, to support matrix multiplication.

    * Low-precision arithmetic (quantization): This approach uses fewer bits for computation (e.g., 4 bits instead of 32 bits), resulting in faster processing, lower power consumption, smaller and more cost-effective chips, and reduced bandwidth requirements.

General-purpose central processing units (CPU) provide support for complex operations with high precision that are not typically required for ML applications, but they typically provide only a few cores. As a result, their architecture is less efficient for training and running ML models compared to graphics processing units (GPU), which have thousands of cores and are designed to perform massively parallel, yet relatively simple, graphics processing. Consequently, GPUs typically outperform CPUs in ML applications, even though CPUs usually run at higher clock speeds. For small-scale ML work, GPUs generally offer the best option.

Some hardware is specifically designed for AI, such as purpose-built Application-Specific Integrated Circuits (ASIC) and System-on-a-Chip devices. These AI-specific solutions feature multiple cores, specialized data management, and the capability to perform in-memory processing. They are best suited for edge computing, while the training of the ML model is performed in the cloud using specialized hardware.

AI-specific hardware architectures continue to be developed. This includes neuromorphic processors, which do not use the traditional von Neumann architecture but rather brain-inspired designs mimicking neuronal structures.

6. ## Development and Hosting of AI Models

AI-based systems can be acquired from third-party vendors or developed privately within an organization. AI-based systems typically rely on pretrained models and can be deployed on-premises or in the cloud, with the models themselves hosted either on-premises or in the cloud, where cloud-based options are often accessed as a service (AIaaS). Third-party AI-based systems typically come as pretrained models or AI as a Service (AIaaS), enabling faster deployment and quicker time-to-market. Alternatively, private AI-based systems (on-premises or customized cloud setups) can be better tailored to specific requirements, but their development will likely require specialized skills, either through in-house experts or outsourced teams.

Local development (coding and training locally) enables direct control and privacy. Small models, such as decision trees or compact neural networks, can be developed on personal computers, while mid-sized models may require dedicated GPUs. For large-scale models, high-performance on-premises server clusters become necessary with their associated energy, cooling, and hardware costs.

Cloud development offers significant flexibility. Public clouds, in particular, provide pre-configured environments with pay-as-you-go pricing, which limits initial hardware investment and scales easily. In contrast, private clouds can provide enhanced security and privacy for applications that require it, but this control necessitates a greater upfront infrastructure investment.

Many organizations adopt hybrid approaches, including developing prototypes locally before scaling to cloud infrastructure, maintaining sensitive components on-premises, such as the preparation of private data, and leveraging cloud resources for compute-intensive tasks.

AI models can be hosted in various environments, ranging from local setups to cloud-based platforms. Local hosting involves running smaller models on personal computers or smartphones, offering privacy and eliminating cloud licensing costs, although this provides limited hardware capabilities. For larger AI models, organizations may establish dedicated servers, which require a significant upfront investment but provide enhanced control.

Cloud hosting of AI models can be on public or private clouds. Public cloud services provide scalable access to robust, powerful infrastructure, eliminating maintenance concerns and making them ideal for fluctuating workloads. Private clouds offer similar benefits, with enhanced security and customization options, and are either managed in-house or through dedicated providers, albeit at a higher cost.

Hybrid approaches combine these methods, allowing organizations to run some operations locally while leveraging cloud elasticity for intensive tasks.

The optimal development and hosting solutions, which are typically decided upon separately, depend on factors such as model size, complexity, performance requirements, budget constraints, security and data privacy considerations, deployment needs and regulatory requirements. Some organizations adopt multi-tiered strategies to balance efficiency and control.

7. ## Machine Learning Development Frameworks

ML development frameworks provide a toolkit for building and training ML models. Typical functionality provided by these frameworks includes:

* Data Handling: They assist with loading, preprocessing, and managing the data used to train and test the model. This might involve cleaning, formatting, and transforming the data into a suitable format for the chosen model.

  * Model Building: These frameworks offer libraries of ML algorithms and tools to design the architecture of the constructed ML model. This includes specifying the type of model (e.g., neural network, decision tree), the number of layers and connections, and the mathematical operations performed within the model.

    * Training and Optimization: Frameworks provide algorithms that iteratively adjust the model's internal parameters based on the training data and on the desired result. The goal is to optimize the model's performance in accomplishing the desired task (e.g., classification, ML regression). Some frameworks may support distributed training and enhance or fine-tune pretrained models.

      * Evaluation: They offer tools to evaluate how well the trained model performs on unseen data. This might involve measuring accuracy, precision, and recall for classification tasks, or error rates for ML regression tasks (see 3.1.1).

      * Deployment: Some frameworks provide capabilities for deploying the trained model for real-world use. This could involve converting the model into a format suitable for integration with web applications, mobile devices, edge devices or embedded systems.

These frameworks can operate at different levels of abstraction. Some offer a lower-level application programming interface (API), providing developers with more control over model building but requiring more coding expertise. Others offer a higher-level API, simplifying model creation but offering fewer customization options.

Different frameworks can focus on different application domains. Some are general purpose and support a wide range of application areas. In contrast, others are more specialized, focusing on specific areas such as image recognition, speech recognition, and language translation.

Selecting the most appropriate framework can depend on several factors, such as:

* the application area;

  * the need for a user-friendly interface for rapid prototyping;

    * configurability for complex models;

      * the expertise of the users;

      * deployment considerations, as some frameworks are better suited for resource-constrained environments;

      * level of (community) support;

      * ecosystem maturity.

    8. ## Regulations and Standards for AI

AI regulations and standards are crucial for the responsible development, deployment, and use of AI. The core aim is to foster trust in AI and help promote realization of AI's benefits while mitigating potential harms. Ideally, compliance with such regulations and standards should guarantee that AI-based systems are safe, fair, transparent, sustainable, accountable, ethical, and used responsibly.

Internationally, the OECD AI Principles \[OECD AI\] and the UN report on Governing AI for Humanity \[UN Gov AI\] serve as influential soft law instruments that foster a shared understanding of responsible AI stewardship. They act as a compass for national governments and organizations as they formulate their own AI strategies. These principles emphasize human-centric AI, ethical considerations, and the importance of international cooperation.

The EU AI Act represents a landmark regulatory step, demonstrating a risk-based approach to regulating AI. By categorizing AI-based systems by risk, from minimal to unacceptable, regulations are tailored accordingly. High-risk systems, particularly those that impact fundamental rights or safety, face stringent requirements that encompass rigorous testing, data governance, and human oversight. The substantial financial penalties for non-compliance, based on a percentage of global turnover, underscore the EU's commitment to enforcement. In contrast, many nations outside the EU are adopting a more permissive approach, favoring lighter-touch regulations to encourage innovation.

Technical standards, developed by organizations such as ISO and IEEE, are crucial for translating high-level aspirations into practical implementations. They provide concrete technical specifications and best practices, bridging the gap between policy and practice. For example, ISO/IEC TR 29119-11 provides detailed guidance on testing AI-based systems, a critical element in demonstrating regulatory compliance. Meanwhile, the ISO/IEC 42119 series is being developed to cover various aspects of AI-based system testing. Furthermore, sector-specific regulations are emerging in areas such as healthcare and finance, recognizing the unique risks posed by AI in these domains.

To effectively navigate this evolving landscape of AI governance, continuous dialogue and collaboration are paramount. Governments, industry, academia, and civil society must actively engage to achieve a harmonized and effective approach to AI governance worldwide. Moreover, given the dynamic nature of AI, regulations and standards must be regularly reviewed and updated to remain relevant and effective in guiding responsible AI development, deployment, and use.

### **Keywords**

Functional adaptability, AI functional correctness, intervenability, AI robustness, safety, societal and ethical risk mitigation, transparency, user controllability

### **AI-Specific** **Keywords**

None

### **Learning** **Objectives** **for** **Chapter** **2:**

1. ### **Quality** **Characteristics** **for** **AI-Based** **Systems**

   AI-2.1.1 (K2)	Classify behaviors of AI-based systems according to the quality characteristics defined in ISO/IEC 25059

AI-2.1.2 (K2)	Explain the special considerations that arise when AI is used in safety-related systems

2. ### **Acceptance** **Criteria** **for** **AI-Based** **Systems**

AI-2.2.1 (K2)	Give examples of acceptance criteria for AI-based systems

This section covers AI-specific quality characteristics outlined in ISO/IEC 25059, which extends traditional software quality models to address unique aspects of AI-based systems. It introduces new and adapted characteristics, including AI functional correctness, functional adaptability, user controllability, transparency, AI robustness, and intervenability, alongside societal and ethical risk mitigation. Major AI safety challenges, such as vague specifications, non-determinism, self-learning, limited explainability, and evolving standards, are also addressed, with an emphasis on their impact on testing and regulation.

1. ## AI-Specific Quality Characteristics

ISO/IEC 25059 extends the quality model from ISO/IEC 25010 to address AI-specific considerations. This extension evaluates AI-based systems from two perspectives: product quality and quality in use. From a testing perspective, these quality characteristics directly influence how test objectives are defined, how acceptance criteria are formulated, and how test results are interpreted for AI-based systems. New and modified characteristics, compared to ISO/IEC 25010, include:

* AI functional correctness (product quality): AI-based systems, especially those using probabilistic ML, cannot guarantee perfect accuracy. Since a certain error rate is expected in AI outputs, the concept of functional correctness has been adjusted accordingly. ISO/IEC 25059 evaluates functional correctness by considering both correct and incorrect outputs and by defining acceptable thresholds for incorrect results, reflecting the inherent variability in AI-based system outputs (see 3.3).

  * Functional adaptability (product quality): a new sub-characteristic of functional suitability. The ability of the AI-based system to autonomously adapt to changes in its operational environment after it is deployed.

    * User controllability (product quality): a new sub-characteristic of interaction capability (note that interaction capability is itself a new term that replaces usability in the 2023 version of ISO/IEC 25010). A property of an AI-based system such that a human or another external agent can intervene in its functioning in a timely manner.

      * Transparency (product quality and quality in use): a new sub-characteristic of interaction capability and a new sub-characteristic of satisfaction. It relates to the degree to which appropriate information about the AI-based system is communicated to stakeholders (see 6.1.2).

      * AI robustness (product quality): a new sub-characteristic of reliability. It describes the ability of an AI-based system to maintain its level of AI functional correctness regardless of circumstances, such as the presence of biased, adversarial, or invalid data inputs, external interference, adverse environmental conditions, and operator misuse.

      * Intervenability (product quality): a new sub-characteristic of security. The degree to which an operator can intervene in an AI-based system’s functioning in a timely manner to prevent harm or hazard.

      * Societal and ethical risk mitigation (quality in use): a new sub-characteristic of ‘Freedom from risk’. Considers many areas to mitigate societal and ethical risk, including accountability, fairness and non-discrimination, professional responsibility, promotion of human values, privacy, safety and security, human control of technology, community involvement and development, human-

  centered design, respect for the rule of law, respect for international norms of behavior, environmental sustainability, and labor practices.

    2. ## AI and Safety

Safety-related systems have the potential to cause injury or harm to people, property or the environment. Developing and testing non-AI safety-related systems can take a lot of effort, but is feasible; however, for AI-based systems, there are several additional challenges:

* Specifications: In traditional safety-related systems, requirements are defined for the complete system and refined until the developer can transform them into code. The requirements for many AI-based systems often begin with vague goals and are then implicitly provided via the training data that encodes patterns, rules, and objectives, without fully formalizing every detail upfront. This can mean that the necessary traceability from requirements to implementation is inadequate for AI-based systems.

  * Non-determinism: This characteristic of many AI-based systems makes it inherently challenging to guarantee the precise behavior of these systems. Even rigorously tested models can exhibit unexpected behavior due to factors such as random number generation or slight variations in input values.

    * Self-learning: Rigorous testing is used to demonstrate the safety integrity of a system before deployment. For self-learning AI-based systems, this is undermined as the system’s behavior progressively moves away from the originally tested behavior. Managing how the model learns and the data it uses can sometimes help to avoid the emergence of new problematic behaviors. Alternatively, safety guards can be implemented to help prevent the model from learning or making decisions that could compromise safety (e.g., a content moderation component to filter prompts).

      * Explainability and Transparency: For safety-related systems, it is essential to understand how and why the system makes decisions. However, the decision-making processes of AI-based systems are often not transparent. Explainable AI techniques, such as LIME (Local interpretable model-agnostic explanations), can provide insights into the AI-based system's reasoning; however, they are not widely available and may compromise system performance.

      * Evolving Regulations: The regulatory landscape for safety-related AI-based systems is constantly evolving. The use of AI is currently not included in mature functional safety international standards, and some of these standards even prohibit its use in such systems. The EU AI Act \[EU AI Act\] (see 1.1.8) classifies AI systems used as safety components (such as in aviation, medical devices, or automotive) as high-risk and imposes strict requirements on their development and testing.

This section outlines acceptance criteria related to the quality characteristics specified in the ISO/IEC 25059 standard, as well as safety. For AI-based systems, acceptance criteria often need to be statistical, probabilistic, or threshold-based rather than binary, which introduces additional testing challenges.

1. ## Acceptance Criteria for AI-Based Systems

When evaluating the quality of an AI-based system, it is essential to consider both functional and non-functional quality characteristics. This helps confirm that the AI-based system functions as intended and satisfies broader quality requirements. The ISO/IEC 25010 and ISO/IEC 25059 standards provide a comprehensive framework for defining software quality. In this section, the focus is on the acceptance criteria associated with the quality characteristics specific to AI (i.e., those defined in ISO/IEC 25059\) and safety (see 2.1.2).

The following table lists example acceptance criteria for safety and each of the quality characteristics defined in the ISO/IEC 25059 standard.

| Characteristic | Example Acceptance Criteria |
| :---- | :---- |
| AI functional correctness (see 3.3) | Accuracy of 95% for an image recognition system. Recall of 90% for a defect prediction system. |
|  Functional adaptability | A maximum of 20 seconds for the engine management system to adapt when it crosses a specified altitude threshold. A video streaming service shall adjust its homepage to recommend at least 40% of documentaries after a user watches three full-length documentaries in a single session. |
|  User controllability | A supervisor can take control of an autonomous drone within 0.5 of a second when it sends a distress signal due to loss of its GPS location. The farm control system notifies the farmer when the sensor’s visual performance degrades by more than 30%, allowing immediate manual override; it fully deactivates if degradation exceeds 50% without user response. |
|  Transparency | Sufficient information is provided about the third-party ML model and the provenance of its training data to meet the requirements of the relevant company standard. The system’s operational dashboard and API must provide an endpoint that returns the unique version identifier of the currently deployed prediction model and a link to its corresponding documentation. |
|  AI robustness | The response time for the AI-based security penetration alert system predictions remains below 1 second when access to the central vulnerabilities database is disrupted for 30 seconds. The edge AI device shall automatically transition to a lower-fidelity, reduced-power inference mode (instead of crashing) when its internal operating temperature exceeds 85°C for a continuous period of 10 seconds. |

|  Intervenability | If a robot breaches its safety zone, the production line is capable of being shut down within 0.5 seconds after a shutdown is initiated. To prevent potential blackouts, the power grid management system shall provide a 30-second confirmation window, during which an engineer can veto any AI-proposed action classified as 'critical' before it is automatically executed. |
| :---- | :---- |
|  Societal and ethical risk mitigation | The automated prison sentencing system does not discriminate between racial groups based on the specified fairness metric. The chatbot must pass an internal "red teaming" assessment with a score of 95% or higher, demonstrating its refusal to generate content that promotes violence, self-harm, or hate speech. |
|  Safety |  Non-AI components of the AI-based steering control system are compliant with ISO 26262-6 at ASIL (automotive safety integrity level) C. 100% of the relationships between inputs and outputs of the ML model in the nuclear power plant control system can be mapped with an average accuracy of no lower than 99.9% by an explainability tool. Control signals that exceed specified safety limits by more than 10% are analyzed and regulated within 0.15 seconds after being detected by the safety monitoring sub-system. |

### **Keywords**

K-multisection neuron coverage, ML functional performance criteria, ML functional performance metric, ML model, neuron boundary coverage, neuron coverage, perceptron

### **AI-Specific** **Keywords**

Association, classification, clustering, data preparation, machine learning, ML algorithm, ML development framework, ML workflow, pretrained model, ML regression, reinforcement learning, supervised learning, unsupervised learning

### **Learning** **Objectives** **for** **Chapter** **3:**

1. ### **Introduction** **to** **Machine** **Learning**

AI-3.1.1 (K2)	Distinguish between the different forms of ML

AI-3.1.2 (K2)	Summarize the workflow used to create an ML system HO-3.1.3 (H2) Create an ML model  
> > > AI-3.1.4 (K2)	Summarize the use of pretrained models, fine-tuning, and retrieval-augmented generation

2. ### **Data** **for** **Machine** **Learning**

AI-3.2.1 (K2)	Explain the activities related to data preparation

HO-3.2.2 (H2)  Perform data preparation to support the creation of an ML model

> > > AI-3.2.3 (K2)	Contrast the use of training, validation, and test datasets in the development of an ML model

3. ### **ML** **Functional** **Performance** **Metrics** **for** **Classification**

   AI-3.3.1 (K3)	Calculate common ML functional performance metrics from a given set of confusion matrix data

HO-3.3.2 (H2)  Evaluate an ML model using selected ML functional performance metrics

> > > HO-3.3.3 (H2) Show the impact of different ML models and dataset combinations on the training and behavior of the models

4. ### **Neural** **Networks**

AI-3.4.1 (K2)	Explain the structure and working of a deep neural network HO-3.4.2 (H1) Experience the implementation of a perceptron  
AI-3.4.3 (K2)	Describe the different coverage measures for neural networks

This section introduces the main categories of ML algorithms: supervised, unsupervised, and reinforcement learning, distinguishing their respective problem types and typical applications. It outlines the standard workflow for developing ML models, from defining objectives and preparing data to training, evaluating, and deploying models, with attention to iteration and system integration. Practical aspects such as hands-on model creation, the use of pretrained models, fine-tuning, and retrieval-augmented generation are also covered, highlighting approaches to efficiently adapt and enhance AI models for new tasks while managing inherited limitations.

Understanding this workflow is essential for testers, as different test activities apply at different stages, and failures often originate in earlier steps such as data preparation or model selection.

1. ## Different Forms of Machine Learning

ML algorithms are categorized into supervised learning, unsupervised learning, and reinforcement learning.

In supervised learning, algorithms train models using labeled data, where each set of inputs has a corresponding output label (e.g., images labeled as “dog” or “cat”). The model learns to map inputs to outputs by identifying patterns in the training data. Supervised learning is typically divided into:

* Classification: This involves assigning inputs to predefined classes, such as classifying emails as spam or not, or image recognition in images.

  * ML regression: This involves predicting continuous numerical values, such as estimating a person’s age based on lifestyle data or forecasting stock prices.

  Note that the term ML regression, when used in the context of ML, differs from its use in other ISTQB® syllabi, where regression describes the problem of software modifications causing change-related defects.

In unsupervised learning, the algorithm trains models using unlabeled data, inferring patterns or structures without explicit output labels. The model groups similar inputs together based on shared features. Unsupervised learning is typically categorized into:

* Clustering: This involves grouping data points based on similarities, such as segmenting customers into different groups for targeted marketing.

  * Association: This involves identifying relationships or dependencies among data attributes, such as finding patterns in customer purchasing behavior to recommend products.

In reinforcement learning, the AI-based system (an “intelligent agent”) learns by interacting with its environment. The agent receives positive feedback (rewards) or negative feedback (penalties) based on the outcome of its actions, enabling it to learn from experience rather than from a dataset. Challenges in reinforcement learning include setting up the environment, designing the reward function, and selecting the best strategy to meet the desired goal. Applications include robotics, autonomous vehicles, and adaptive systems like chatbots.

Each ML approach addresses different types of problems, with the choice depending on the nature of the available data and the specific task at hand.

2. ## Machine Learning Workflow

The activities in the ML workflow, shown in Figure 1, are:

### **Understand** **the** **Objectives**

The purpose of the ML model is understood and agreed to by the stakeholders to verify alignment with business priorities. Acceptance criteria (including ML functional performance metrics – see [3.3](#heading=h.t6ag4l1m5xqk)) are defined for the developed model.

### **Select** **a** **Framework**

A suitable ML development framework (see 1.1.7 for details on provided functionality) is selected based on the objectives, acceptance criteria (see 2.2), and business priorities.

### **Select** **&** **Build** **the** **Algorithm**

An ML algorithm is selected based on various factors, including the objectives, acceptance criteria, and the available data (see [3.2](#heading=h.l390cwtiisej)). The algorithm may be manually coded, but it is often retrieved from a software library. The algorithm is then compiled, if required.

### **Prepare** **&** **Test** **Data**

Data preparation (see [3.2](#heading=h.l390cwtiisej)) comprises data acquisition, data preprocessing, and feature engineering. Exploratory data analysis (EDA) may be performed alongside these activities.

The data used by the algorithm and model are based on the objectives and are utilized by all activities in the ‘model generation and test’ box shown in Figure 1\.

The data used to train, evaluate, tune, and test the model must be representative of the data that will be used by the model operationally.

Testing of the data and any automated data preparation steps is performed (see Chapter [5](#heading=h.nzjeyvp61cgz)).

### **Train** **the** **Model**

The selected ML algorithm uses training data to train the model.

Parameters defining the model structure (e.g., the number of layers of a neural network or the depth of a decision tree) are passed to the algorithm. These parameters are known as model hyperparameters.

Parameters that control the training (e.g., the number of iterations to use when training a neural network) are also passed to the algorithm. These parameters are known as algorithm hyperparameters.

### **Evaluate** **the** **Model**

The model is evaluated against the agreed ML functional performance metrics (see 3.3), using the validation dataset, and the results are used to improve the model in the ‘tune the model’ activity. In practice, several models are typically created and trained using different algorithms (e.g., random forests, SVM, and neural networks) and various training datasets, and the best combination is chosen based on the evaluation results.

### **Tune** **the** **Model**

The results from the evaluation are used to adjust the model hyperparameters and the algorithm hyperparameters. The model is then retrained with these adjusted settings to improve its ML functional performance.

The three activities of training, evaluation, and tuning comprise ‘model generation’, as shown on Figure 1\.

### **Test** **the** **Model**

Once an acceptable model has been generated by the ‘model generation’ activities, it is tested using an independent test dataset to verify that the agreed ML functional performance criteria are met. The test results are also compared with those from the evaluation. If the performance of the model with independent test data is significantly lower than during evaluation, it may be necessary to return to the ‘model generation’ activities, or even to the ‘prepare & test data’ activity to train a new model.

In addition to ML functional performance tests, non-functional tests, such as for the time to provide a prediction, may also be performed. Typically, testing in this activity is performed by data engineers or scientists; however, testers with sufficient knowledge of the domain and access to the relevant resources can also perform this testing.

### **Deploy** **the** **Model**

Once ‘model generation & test’ is complete, the tuned model is typically re-engineered for deployment along with its data pipeline. This is generally achieved through the ML development framework. Target platforms might include embedded systems and the cloud, where the model can be accessed via a web API. The re-engineered deployed model is tested to verify it still meets its acceptance criteria.

### **Use** **the** **Model**

Once deployed, the model is typically integrated into a larger operational AI-based system. Models may perform scheduled batch predictions at set time intervals or run in real-time upon request.

### **Monitor** **&** **Tune** **the** **Model**

While the model is being used, its situation may evolve, and the model may drift away from its intended performance (see [6.1.7](#drift-testing)). To verify that any drift is identified and managed, the operational model is regularly evaluated against its acceptance criteria.

It may be deemed necessary to create a new model by retraining with new data, retraining with new hyperparameters, or both. The latest model may then be compared to the existing model using a form of A/B testing (see 6.1.9).

The ML workflow shown in Figure 1 is a logical sequence; however, in practice, the workflow is applied iteratively, with steps repeated.

The steps shown in Figure 1 do not include the integration of the ML model with the non-ML parts of the overall system. Typically, ML models cannot be deployed in isolation and must be integrated with non-ML components (e.g., in vision applications, a data pipeline is used to clean and modify data before submitting it to the ML model). When the model is part of a large system, it must be integrated into this system before deployment. In this case, integration, system, and acceptance test levels may be performed.

![][image1]

Figure 1: ML Workflow

3. ## Hands-on Exercise: Create a Machine Learning Model

Select, train, and test a classification model using supervised learning.

Explain the difference between evaluating/tuning and testing by comparing the accuracy achieved with validation and test datasets.

4. ## Pretrained Models, Fine-Tuning, and Retrieval-Augmented Generation

Training a new AI model from scratch is both costly and time-consuming. To address this, a common solution is fine-tuning, which involves taking a pretrained neural network and adapting it to perform a new, different task. One of the key benefits is that it requires much less training data (and training effort) compared to building a model from scratch.

The pretrained model is fine-tuned by performing additional training with data specific to the new task. The tuning can be applied to the entire neural network, only to specific layers (typically near the output end of the neural network), or to additional layers. After training, the model’s ML functional performance is evaluated, and based on these results, further fine-tuning may be performed until the model meets the necessary acceptance criteria.

Fine-tuning success depends on the similarity between the original and new tasks. Small differences can lead to highly effective fine-tuning. For example, adapting a cat breed image classifier to identify dog breeds is likely to work well. However, adapting it for spoken accents is less effective due to the larger

difference. Similarly, fine-tuning an LLM for ISTQB-defined boundary value analysis requires a small change for the LLM and is readily achievable with good training data.

An alternative to fine-tuning is Retrieval-Augmented Generation (RAG), which involves providing data sources to the LLM that are specific to the required task. These data sources are transformed into a searchable format that allows them to be compared to the subject of the prompt. Once relevant documents are identified, these are incorporated into an enhanced prompt, which is passed to the LLM. As more pertinent information is now provided to the LLM, its corresponding response is likely to be more precise. With RAG, no change is made to the pretrained model.

A pretrained model can use RAG, fine-tuning, or both together to enhance performance.

Typically, any biases or vulnerabilities in the pretrained model will carry over to the new model, so testing is necessary to confirm that it performs reliably and fairly in the new task.

Data preparation is recognized as one of the most crucial and resource-intensive activities in the ML workflow. If operational data differs significantly from training data, ML functional performance and safety assumptions may no longer hold. Data preparation typically consumes a significantly larger proportion of the overall effort compared to other stages, such as model selection and building. Data preparation is intrinsically linked to the data pipeline, which processes raw data and transforms it into a usable format for both training and prediction by ML models.

1. ## Activities in Data Preparation

Data preparation supports the achievement of the quality and suitability of data for model training. It involves several key activities:

* Data acquisition:

  * Identifying relevant data types (e.g., numerical, categorical, images, text).

    * Gathering data from diverse sources, such as databases, APIs, or real-time sensors.

      * Labeling data for supervised learning tasks, verifying accuracy and consistency.

  The acquired data can take various forms (e.g., numerical, categorical, image, tabular, text, time series, sensor, geospatial, video, and audio).

      * Data preprocessing:

        * Cleaning data, including:

          * removing defects, duplicates, and outliers to verify data accuracy and consistency;

          * imputing missing values using techniques like mean, median, or mode to maintain data completeness;

          * anonymizing or removing personal information to protect privacy and comply with regulations.

        * Transforming data formats, scaling, and normalizing to achieve consistency.

        * Augmenting data to increase sample size, incorporating adversarial examples to enhance robustness against adversarial attacks, and generating synthetic data.

        * Sampling subsets to reduce training times and computational costs.

      * Feature engineering:

        * Selecting relevant features based on their contribution to ML model performance.

        * Extracting a subset of informative and non-redundant features from existing features to reduce training times and computational costs.

In parallel to these data preparation activities, exploratory data analysis (EDA) is also typically carried out to provide insights into the data. This includes:

* discovering trends, patterns, and anomalies in the data;

  * visualizing data using plots and charts for better understanding.

Preparing training data is typically an iterative process, often performed manually, and individual data preparation activities may be reordered or omitted based on specific project requirements. The operational data should match the characteristics of the training data (e.g., data distributions and feature ranges) so that the model performs as expected in production. However, the preparation steps themselves may be adjusted for production efficiency and scalability.

2. ## Hands-on Exercise: Data Preparation in Support of the Creation of a Machine Learning Model

For a given set of data, perform the applicable data preparation steps as outlined in Section 3.2.1 to produce a dataset that will be used to create a classification model using supervised learning.

This activity serves as the first step in creating an ML model that will be utilized in future exercises.

To perform this activity, students will be provided with appropriate (and language-specific) materials, including:

* libraries;

  * ML development framework;

    * tools.

    3. ## Training, Validation, and Test Datasets

Logically, three sets of equivalent data (e.g., randomly selected from a single representative dataset) are required to develop an ML model:

* A training dataset is used to train the model.

  * A validation dataset is used for evaluating and subsequently tuning the model.

    * A test dataset, also known as the holdout dataset, is used to test the tuned model.

If an abundance of suitable data is available, the amount of data used in the ML workflow for training, evaluation, and testing typically depends on the following factors:

* The expected complexity of the model.

  * The algorithm used to train the model.

    * The availability of resources, such as RAM, disk space, computing power, network bandwidth, and the available time.

      * The desired confidence in the resultant model.

When data is limited, a three-way split (train, validation, and test) can result in insufficient data for effective model training, thereby increasing the risk of underfitting. To address this, a common strategy is to set aside a small, final hold-out test set if feasible. The remaining data (the combined training and validation pool) is then used for techniques like k-fold cross-validation (where k is a user-specified integer, commonly 5 or 10).

In k-fold cross-validation, this data is divided into k 'folds.' For each fold, the model is trained on k-1 folds and validated on the held-out fold. This process is repeated k times, with each fold serving as the validation set once. This allows for robust hyperparameter tuning and ML functional performance estimation. Data is typically randomly assigned to folds, often using stratified sampling to make each fold representative, especially with imbalanced data or small datasets.

The performance metrics (e.g., accuracy, F1-score – see 3.3.1) from each fold's validation are then averaged to provide a more reliable estimate of the model's generalization ability. After identifying the optimal hyperparameters through cross-validation, a final model is typically trained on the entire training and validation pool (all data except the hold-out test set) using these hyperparameters. This final model is then evaluated once on the hold-out test set for a final, unbiased performance assessment. If a hold-out test set is not feasible due to extreme data scarcity, the average cross-validation performance is optimistically biased and cannot serve as an unbiased estimate.

Other resampling methods for limited data include leave-one-out cross-validation (a special case of k-fold where k equals the number of samples) and bootstrap techniques.

In classification tasks (see 3.1.1), a confusion matrix can be used to evaluate a model's predictions, categorizing them as true positives, true negatives, false positives, or false negatives. Key metrics, such as accuracy, precision, recall, and F1-score, are derived from this. These metrics measure classification quality, highlighting the ML model’s strengths and weaknesses. This section explores the calculation and interpretation of these metrics to assess ML functional performance.

1. ## Calculation of Machine Learning Functional Performance Metrics

In a classification problem, a model will rarely predict the results correctly all the time, partly due to the probabilistic nature of ML models and data noise. For any such problem, a confusion matrix can be created with the following possibilities:

|  |  | Actual |  |
| :---- | ----- | ----- | :---- |
|  |  | **Positive** | **Negative** |
|  **Predicted** |  **Positive** | **True** **Positive** **(TP)** | **False** **Positive** **(FP)** |
|  |  **Negative** | **False** **Negative** **(FN)** | **True** **Negative** **(TN)** |

Figure 2: Confusion Matrix

Note that the confusion matrix shown in Figure 2 may be presented differently (e.g., predicted and actual swapped), but it will always yield values for the four possible situations of true positive (TP), true negative (TN), false positive (FP), and false negative (FN).

Based on the confusion matrix, the following metrics are defined:

* Accuracy \= (TP \+ TN) / (TP \+ TN \+ FP \+ FN) \* 100%

  Accuracy measures the percentage of all correct classifications.

  * Precision \= TP / (TP \+ FP) \* 100%

  Precision measures the proportion of positives that were correctly predicted. It is a measure of how sure one can be about positive predictions.

    * Recall \= TP / (TP \+ FN) \* 100%

  Recall (also known as sensitivity) measures the proportion of actual positives that are correctly predicted. It is a measure of how confident one can be that no positives will be missed.

      * F1-score \= 2 \* (Precision \* Recall) / (Precision \+ Recall)

  F1-score is calculated as the harmonic mean of precision and recall, with values ranging from 0 to 100\. A score close to 100 means the model achieves both high precision and high recall, indicating that classification errors (false positives and false negatives) have minimal impact.

  Conversely, a low F1-score indicates the model struggles to accurately identify positives, either missing true cases or generating many false alarms.

    2. ## Hands-on Exercise: Evaluate a Machine Learning Model using Selected ML Functional Performance Metrics

Using the classification model trained in the previous exercise, calculate and display the values for accuracy, precision, recall, and F1-score. Where applicable, use the library functions provided by your ML development framework to perform the calculations.

3. ## Hands-on Exercise: Show the Impact of Different Machine Learning Models and Dataset Combinations

Following the previous exercise, use different ML models and dataset combinations to observe their effect on the training of the ML model, as well as the final behavior of the model. Observe the training times and the ML functional performance metrics.

Artificial neural networks were initially designed to mimic the functioning of the human brain, which can be thought of as a network of interconnected biological neurons.

The single-layer perceptron is one of the earliest examples of implementing an artificial neural network, comprising just one layer. It can be used for supervised learning of binary classifiers for linearly separable problems, which determine whether an input belongs to a specific class or not. For example, a perceptron can distinguish between emails that are spam and those that are not spam, by learning to separate the features of the two categories with a straight line in the input space.

Most current neural networks are considered to be deep neural networks because they comprise several layers. Fully connected networks can be considered as multi-layer perceptrons (see Figure 3).

Figure 3: Structure of a deep neural network

1. ## Structure and Working of a Deep Neural Network

A deep neural network is typically described as comprising three main types of layers. The input layer receives inputs, for example, pixel values from a camera. The output layer provides results to the outside world. This might, for example, be a value indicating the likelihood that the input image is of a cat.

Between the input and output layers are hidden layers composed of artificial neurons, also known as nodes. In many common architectures, such as fully connected networks, the neurons in one layer are connected to each of the neurons in the next layer, and there may be different numbers of neurons in each successive layer.

The neurons perform computations and pass information across the network from the input neurons to the output neurons, gradually transforming the input data into increasingly abstract representations until reaching the output.

The computation performed by each neuron (after those in the input layer) generates what is known as the activation value. This value is calculated by first computing a weighted sum of the activation values from all connected neurons in the previous layer, where each such connection has its own independent weight, and adding the neuron's individual bias. This sum is then passed through a non-linear formula called the activation function. Note that this bias is unrelated to the bias considered in [5.1.2.](#testing-for-bias) Using different activation functions yields different activation values.

Figure 4: Computation performed by each neuron

The weights connecting neurons and each neuron's bias value are typically initialized to small random values (biases sometimes to zero) at the start of training. The training data is passed through the network, with each neuron running the activation function, to generate an output ultimately. The generated output is then compared with the known correct result. The resulting error (or loss), which quantifies this difference, is then fed back through the network to adjust the values of the weights and biases, thereby minimizing this difference. As more training data is fed through the network (each pass through the training dataset is called an epoch), the weights and bias values are gradually adjusted as the network learns. After some time, ideally, the output produced is considered good enough to end training.

2. ## Hands-on Exercise: Experience the Implementation of a Perceptron

Students will be led through an exercise demonstrating a Perceptron learning a simple function, such as an AND function.

The exercise should cover how a Perceptron learns by modifying its weights and bias values across multiple epochs until the error is minimized to zero. Various mechanisms (e.g., spreadsheet, simulation) may be used for this activity.

3. ## Coverage Measures for Neural Networks

Neural network structural coverage metrics have emerged to assess how thoroughly test inputs exercise a model’s internal mechanisms. As neural networks do not follow explicitly coded paths, but their behavior is dictated by learned weights, bias values, and activations, this creates a need for specialized coverage measures to evaluate the extent to which different parts of the network have been activated under test conditions.

Typical approaches include \[COV\_REF\]:

* Neuron Coverage: Measures the proportion of neurons in the network where their output exceeds a specified threshold during testing.

  * k-Multisection Neuron Coverage (kMNC): The possible output range of each neuron is divided into k sections. kMNC is the proportion of these sections activated during testing.

    * Neuron Boundary Coverage (NBC): Measures the proportion of neurons in the network where their output either exceeds the maximum achieved in training, or is less than the minimum achieved in training during testing.

These coverage metrics can be helpful in AI testing, primarily by revealing areas of the model that remain untested, which may potentially hide defects or unlearned behaviors. For example, if certain neurons or layers never activate during testing, the model’s performance in related decision boundaries might be questionable. Such insights help testers design additional test inputs or test conditions to exercise underexplored parts of the network. At present, commercial tools supporting these specific coverage measures are limited.

However, structural coverage alone does not guarantee that a neural network will generalize well or handle real-world variations. Neural networks can learn spurious correlations, leading to correct activations for incorrect reasons. Consequently, testers should also use other test techniques, like adversarial testing and metamorphic testing, as described in chapters 5, 6 and 7\.

### **Keywords**

Attack, exploratory testing, risk-based testing, test oracle

### **AI-Specific** **Keywords**

Adaptive AI-based system, AI-based system, generative AI, large language model, locked AI-based system

### **Learning** **Objectives** **for** **Chapter** **4:**

1. ### **Introduction** **to** **Testing** **AI-Based** **Systems**

AI-4.1.1 (K2)	Compare the testability of locked and adaptive AI-based systems

AI-4.1.2 (K2)	Explain why a statistical approach is often needed when testing AI-based systems AI-4.1.3 (K2)	Explain the challenges and solutions relating to test oracles for AI-based systems

2. ### **Testing** **Generative** **AI** **and** **LLM**

AI-4.2.1 (K2)	Explain how generative AI can be tested AI-4.2.2 (K3)	Implement red teaming for GenAI systems

HO-4.2.3 (H2)  Apply exploratory testing to an LLM performing boundary value analysis

3. ### **Test** **Levels** **and** **Machine** **Learning** **Systems**

AI-4.3.1 (K2)	Summarize the test levels used to develop machine learning systems AI-4.3.2 (K2)	Explain how risk-based testing is applied to machine learning systems

Testing AI-based systems presents unique challenges compared to testing conventional software. Firstly, AI-based systems can be broadly categorized as locked or adaptive. Locked AI-based systems, with fixed behavior post-deployment, are easier to test due to their mostly deterministic nature, while adaptive systems, which evolve and learn, introduce complexity as their behavior can change unpredictably.  
Additionally, the probabilistic nature of many AI models often necessitates statistical testing, as deterministic methods may be insufficient for evaluating outputs influenced by data and probabilities. This requires assessment of performance distributions and confidence levels across diverse scenarios.

A central challenge in testing, known as the ‘test oracle problem’, arises when determining whether the output produced by the system under test is correct for a given input. In traditional software, well-defined specifications make it relatively straightforward to specify expected results and verify correctness.

However, with AI-based systems, especially those tackling complex or subjective tasks, clearly defining expected results can be difficult or even impossible. This uncertainty is compounded for tasks that exceed human capabilities, involve fuzziness, or lack objective ‘ground truth’, making it hard to implement automated test oracles and sometimes requiring expert judgment or statistical reasoning.

Vague or incomplete system requirements further exacerbate the test oracle problem in AI testing. Solutions may include using statistical evaluations, consulting domain experts, or defining a 'ground truth' against which to assess outputs. These approaches aim to establish reliable expectations and effectively evaluate AI-based systems.

1. ## Locked and Adaptive AI-Based Systems

Many AI-based systems in use today are locked AI-based systems, which do not change their behavior once they are deployed. An example of a locked AI-based system is a deployed ML model based on a DNN, where the DNN’s weights and biases are fixed after development and can only be modified if the DNN is retrained. Safety-related self-driving car technology often relies on locked AI-based systems for specific tasks, such as lane detection or traffic sign recognition.

In contrast, an adaptive AI-based system, such as a reinforcement learning system, can adapt its behavior once it is deployed. The changes might be based on a reward function or to adapt to a new operational environment, but the specific details of such changes cannot be predicted in advance. For example, an e\-commerce platform could use adaptive AI to recommend products to users based on their past behavior and evolving preferences.

Many GenAI systems, such as LLM-based chatbots, are deployed as locked models at runtime but are updated periodically, placing them between fully locked and fully adaptive systems.

In practice, AI-based systems span a continuum from fully deterministic, locked-down systems that produce the same output for a given input, to deliberately non-deterministic, self-learning systems that adapt and evolve their behavior.

Locked AI-based systems are far easier to test than adaptive AI-based systems, as they are largely deterministic and thus the expected results do not change. An updated, locked AI-based system is typically considered a new system, and a fresh round of testing is required. Note, however, that while locked AI-based systems are generally considered deterministic, in practice, large neural networks can exhibit non-deterministic behavior due to factors such as floating-point precision limits and variations in hardware execution, particularly when using parallel computation or GPUs.

An adaptive AI-based system can be rigorously tested before deployment (e.g., by simulating changes in environmental conditions, testing the learning mechanism itself, or testing its ability to adapt appropriately

in controlled scenarios). However, this testing is more complex than for a locked AI-based system, as an adaptive system may change its behavior during the testing or as a result of the testing.

As new behaviors for an adaptive AI-based system cannot always be predicted, such unpredictable behaviors cannot be tested in advance, nor can test cases be prepared for them. An automated test suite, focused on the system’s core functionality, can be built and executed whenever the system undergoes significant changes to verify that adaptations are safe.

Testing can also be used to check that the system’s performance has not degraded beyond a certain threshold. This testing may be in response to significant system changes or as a part of ongoing monitoring.

2. ## Rationale for a Statistical Approach to Testing AI-Based Systems

Testing AI-based systems presents unique challenges due to their data-driven and probabilistic nature. The reasons a statistical approach to testing is needed for testing AI-based systems include:

* Non-Determinism \- AI-based systems are fundamentally probabilistic and therefore often exhibit non-deterministic behavior, meaning the same inputs may not always yield the same output. This can be due to stochastic elements in their architecture or to their implementation of probabilistic mappings learned from training data. Consequently, a single test, such as an instance where a model incorrectly classifies a cat as a dog, cannot accurately reflect the model’s overall AI functional correctness. To confirm that test results reliably overcome this uncertainty, the test suite must be sufficiently large to provide statistically significant results.

  * Distributional Performance Evaluation \- AI models are trained on specific data distributions that do not exactly match their operational environment. To assess how a model will perform under real-world conditions, a statistically significant sample of scenarios from relevant operational data distributions must be tested. This confirms that the testing captures the operational variability in data and subsequent model behaviors.

    * Handling Uncertainty and Bias \- AI-based systems are susceptible to data biases and can produce confident but incorrect predictions. Statistical testing allows practitioners to quantify and analyze model accuracy, fairness, and AI robustness through performance metrics such as confidence intervals, hypothesis testing, and error analysis.

      * Regulatory and Safety Context \- In regulated industries (e.g., healthcare, transport), demonstrating that an AI-based system meets safety or fairness thresholds with high confidence is often required. Statistical methods support claims about a model’s reliability across a broad range of scenarios, rather than just for specific examples.

A statistical approach to the testing of probabilistic MLS is provided in 6.1.3.

3. ## Test Oracles for AI-Based Systems

Testing AI-based systems can be challenging, particularly when determining expected results (the test oracle problem). These difficulties arise from various factors inherent to AI:

* Probabilistic & Non-deterministic Nature: AI outputs can vary even with identical inputs. While many systems (e.g., in supervised learning) have a single correct target value, the model’s outputs are probabilistic and defining a strict passed/failed oracle often requires setting thresholds or tolerance ranges.

  * Exploratory Development & Incomplete Specifications: AI development is frequently exploratory. System requirements may evolve, be incomplete, or simply missing, lacking the detailed specifications needed to generate precise expected results.

    * Complexity of Tasks: AI-based systems often tackle tasks that are too complex for straightforward human verification, making manual checks of expected outputs impractical.

      * Subjectivity of Behavior: The correctness of an AI-based system’s behavior can be subjective. For instance, user expectations for virtual assistants can vary widely, complicating the establishment of universally agreed-upon expected results.

      * Self-Learning Systems: These AI-based systems continuously update their internal models based on new data encountered post-deployment. This causes the AI-based system’s ‘correct’ behavior to change over time so that system responses remain effective and appropriate even as the definition of ‘correct’ evolves over time. As a result, an initial set of expected results can quickly become invalid.

The test oracle problem with AI-based systems can be addressed in various ways:

* Defining Output Boundaries: Testers can use agreed acceptable ranges, distributions, specified limits, and tolerances, such as an autonomous car stopping within a maximum distance.

  * Defining Environmental Boundaries: Testers must specify values for test environment conditions (e.g., lighting levels, temperature, network latency) to ensure outputs are predictable and repeatable.

    * Expert Consultation: Domain experts can help define expected results, though their opinions might differ or be fallible.

      * Specialized Testing: A/B testing, back-to-back testing, and metamorphic testing, among others, can assess AI-based systems by comparing behaviors or verifying properties, often without requiring explicit expected outputs for every case.

      * Proxy Oracles: Use secondary systems or models (including other AI systems) to assess or validate outputs when direct expected results are unavailable, such as training a proxy model on labeled data to predict for unlabeled tests.

This section outlines practical methods for validating GenAI systems, covering black-box evaluation, red teaming, and hands-on techniques. It highlights challenges from diverse inputs, tunable parameters, and context windows, and addresses both functional and non-functional quality measures using benchmarks and targeted exercises. See CT-GenAI syllabus \[CT-GenAI\] for more details on using GenAI systems for testing.

1. ## Testing Generative AI

Testing GenAI involves evaluating the correctness, coherence, and creativity of its outputs, including the originality and novelty of results generated, and verifying that specified requirements, both functional and non-functional, are met. Since GenAI systems can produce text, images, video, and audio, test strategies must be adapted to assess quality characteristics of such content.

A common approach is black-box testing, where testers feed various inputs (prompts, images, partial data) into the system and assess the test results (see red teaming, 4.2.2). Factors such as clarity, originality, and adherence to domain-specific rules are considered. This approach, whether manual or automated, is particularly useful for end-user applications, such as chatbots or design tools, where user satisfaction depends on the usefulness and plausibility of the generated content.

A significant challenge in testing a GenAI model is the ‘input explosion problem’, in which inputs can be highly diverse and complex to control. For instance, there are optional system prompts and a user prompt, which can include enormous amounts of disparate data, and GenAI can also be accessed via an API. There are also multiple parameters to consider, such as temperature and maximum tokens, which will also affect the output. Additionally, the context window, which retains previous parts of a conversation, also affects the generated output.

In many situations, assessing the output may involve manual review; however, determining whether a test has passed or failed depends on qualitative evaluation criteria defined in the requirements. Alternatively, a second GenAI system can often be used to automatically determine the test result. For instance, the correctness of an image generated by a GenAI system can be checked by an image recognition system. Such approaches should be used carefully, as they may reproduce similar biases or errors.

Non-functional testing can be as necessary as functional testing for GenAI systems. This includes evaluating resource utilization during both inference and training to verify efficient operation and cost-effectiveness. Measures include CPU and GPU usage, memory consumption, network bandwidth, and response times.

Benchmark suites provide standardized evaluation frameworks for assessing the capabilities of GenAI. These curated datasets and associated tasks enable consistent comparison across different models, measuring various aspects, from language understanding to reasoning and coding abilities. By measuring GenAI against these benchmarks, areas for improvement can be identified in a systematic, reproducible manner.

2. ## Red Teaming

Red Teaming (RT) is a systematic, often black-box form of fault attack that probes an AI-based system to identify harmful capabilities, particularly in its outputs. Drawing inspiration from historical practices like military wargaming and NASA's tiger teams, AI RT involves ‘attacking’ an AI-based system, with the goal of deliberately causing the system to produce harmful or undesirable results, such as privacy violations, the expression of racist views or providing guidance on performing chemical, biological, radiological, or nuclear (CBRN) attacks. Once such capabilities are identified, they are used to update and strengthen the system, making it less prone to such outputs in the future. While RT can be applied to any AI-based system, it is especially critical for GenAI due to the vast range of possible inputs and outputs, which create an extensive ‘attack space’. RT typically covers the complete end-to-end AI-based system, but can be applied to only the AI model.

Many organizations focus RT on security and safety vulnerabilities; however, it can also be used to detect harmful capabilities in other areas, such as reliability, privacy, fairness, bias and the generation of misinformation. RT is increasingly becoming a regulatory expectation for some types of AI-based systems, as seen in frameworks such as the EU AI Act \[EU AI Act\]. As an adaptive, dynamic evaluation approach in which prompts can immediately be updated in response to outputs, RT complements static approaches like benchmarking by testing systems under extreme and unexpected conditions.

When RT is used for security evaluations, the system is tested to identify vulnerabilities to external attacks, including both non-AI and AI-specific security factors, such as indirect prompt injection attacks and the hiding of malicious content in documents used by RAG. While security RT tends to focus on

malicious inputs, for safety and other evaluations, the aim is often to identify how the system might create harmful outputs under ordinary use, such as generating unsafe medical advice, without any adversarial intent from the user.

RT is most effective when conducted before a system is deployed, but after initial internal quality assessments are complete. The core activity is often interactive prompting, where red teamers engage in multi-turn dialogues (e.g., 15-20 turns) to elicit defective or policy-violating behaviors. The approach typically involves:

1) Assembling a diverse team of testers to cover a wide range of perspectives and attack vectors.

   2) Providing access to the AI-based system in a safe test environment.

      3) Prompting the system to identify vulnerabilities, through open-ended exploration or using checklists.

         4) Analyzing the identified failures to understand threats.

         5) Creating datasets from these threats to support mitigations and system improvements.

To achieve comprehensive coverage by RT, organizations employ several strategies beyond small expert teams. These include manual approaches like crowd-sourced prompt generation, and automated approaches, such as where an LLM is used to generate numerous attack prompts, and the outputs are then checked by another LLM. Hybrid approaches combine the creativity of human testers with the scalability of automation.

RT, which is proactive and pre-deployment focused, complements Blue Teaming, which involves ongoing, real-time defensive monitoring and filtering of inputs to an operational AI-based system to protect it against attacks. Insights from RT can be used to enhance the monitoring and filters used in Blue Teaming.

3. ## Hands-on Exercise: Exploratory Testing of a Large Language Model

Students will perform exploratory testing of an LLM. Students will be provided with an exploratory testing session sheet focused on testing the LLM’s ability to generate test cases using 2-value and 3-value boundary value analysis. As part of the session debrief, they will verify the correctness and completeness of the output.

MLS require specialized test levels to address unique ML risks. These are input data testing and ML model testing. Additionally, conventional test levels are still relevant, including component, component integration, system, and acceptance testing.

1. ## Test Levels for Machine Learning Systems

The non-AI components of an MLS can be tested using conventional test levels. In addition, ML models and MLS require further testing to address the specific risks associated with ML.

Two specialized test levels are used to address ML-specific risks:

* Input data testing (see Chapter 5): Concerned with the training data used for training an ML model and the production data used by an MLS to generate a prediction in the operational environment.

  * ML Model testing (see Chapter 6): Concerned with the testing of the ML models, which are the ultimate output of the ML workflow (see 3.1.2).

The risks associated with ML cannot all be addressed using these two ML-specific test levels. The following test levels are also typically required, depending on the perceived risks:

* Component Testing: Applicable to any non-AI components, such as user interface, data pipeline and communication components.

  * Component Integration Testing: Includes testing that the inputs from the data pipeline are received as expected by the model and that any predictions generated by the model are exchanged with the relevant system components (e.g., the user interface) and used correctly. Where AI is provided as a service (see [1.1.6](#development-and-hosting-of-ai-models)), API testing of the provided service is performed as part of component integration testing.

    * System Testing: Includes confirmation testing that the ML functional performance from the initial model testing is not adversely affected when the model is embedded within a complete system. This testing is especially important when the ML model has been deliberately changed (e.g., by compressing a DNN to reduce its size). Non-functional testing is also covered, for example, testing the performance efficiency of the time required to deliver a prediction from a complete AI-based system.

      * System Integration Testing: Focuses on verifying the interfaces and data exchanges between the AI-based system and external systems or services, using an environment representative of operational conditions.

      * Acceptance Testing: Where AI is used as a service, acceptance testing may be needed to determine the suitability of the service for the intended system and whether, for example, ML functional performance criteria have been achieved.

    2. ## Risk-Based Testing of Machine Learning Systems

Risk-based testing should be applied to all systems, regardless of whether they contain AI components or not. Most regulatory frameworks, whether published or in development, require a risk-based approach to the development and management of AI-based systems. As AI-based systems pose unique risks, testing them differs from that of non-AI-based systems.

There is no standard way to categorize ML risks; however, ML-specific risks are associated with both the development of the MLS (project risks) and with the MLS itself (product risks). One way of categorizing these risks is to use the ML workflow and divide it into three main areas:

* Development \- concerned with the ML algorithm, the development of the model, and the ML development framework. Example project risks include sub-optimal algorithm selection, poor selection of evaluation approach, and framework security vulnerabilities. See Chapter [7](#heading=h.i1ynzpdhd4ur) for more details.

  * Input data \- concerned with providing training data to support ML and the provision of production data used by the model in its operational environment. Examples of product risks include biased

  training data, data-pipeline defects, and unrepresentative training data. See Chapter 5 for more details.

    * Model \- concerned with the generated ML model. Example product risks include failure to achieve required ML functional performance measures, an overfitted model, and susceptibility to adversarial examples. See Chapter 6 for more details.

Another way of categorizing risks associated with AI is according to the quality characteristics defined in ISO/IEC 25059\.

Several forms of testing are available that address these risks and are specifically designed for the testing of MLS. For instance, data pipeline testing, adversarial testing, and review of algorithm/model suitability. This syllabus covers several of these in chapters [5,](#heading=h.nzjeyvp61cgz) [6,](#heading=h.kgpjbng9fqg5) and [7\.](#heading=h.i1ynzpdhd4ur)

### **Keywords**

Data pipeline testing, data representativeness testing, dataset constraint testing, input data testing, label correctness testing, review, testing for bias

### **AI-Specific** **Keywords**

Disparate impact analysis, multiple annotation

### **Learning** **Objectives** **for** **Chapter** **5:**

1. ### **Input** **Data** **Testing** **for** **Machine** **Learning** **Systems**

   AI-5.1.1 (K2)	Give examples of test approaches used for the risk mitigation of input data for a machine learning system

AI-5.1.2 (K2)	Explain how to test for bias

AI-5.1.3 (K2)	Summarize the various forms of data pipeline testing AI-5.1.4 (K2)	Explain how to test for data representativeness

AI-5.1.5 (K3)	Apply dataset constraint testing AI-5.1.6 (K2)	Explain label correctness testing

HO-5.1.7 (H2)  Perform input data testing for ML datasets

The objective of input data testing is to confirm that the data used by the MLS for training, testing, and prediction is of sufficient quality (see [3.2](#heading=h.l390cwtiisej)). It includes reviews, statistical techniques (e.g., testing data for bias), EDA of the training data, and static and dynamic testing of the data pipeline.

1. ## Input Data Risks and Mitigations

The following table lists examples of input data risks and corresponding testing that could be used for risk mitigation:

| Potential Risks | Possible Risk Mitigations |
| :---- | :---- |
| Defects in the training data leading to bias Problems within the algorithm, model, or ML development framework that introduce systemic unfairness | Testing for bias – see [5.1.2](#testing-for-bias) |
| Training data acquired from untrustworthy sources Data is poorly managed | Data provenance testing |
| Poisoned training data | A/B testing – see [6.1.9](#a/b-testing) Data provenance testing EDA – see 3.2.1 Attacks as part of red teaming – see 4.2.2 |
| Internally inconsistent dataset Out of range data Wrong data types | Dataset constraint testing – see [5.1.5](#dataset-constraint-testing) |
| Sub-optimal feature selection | Feature testing |
| Imbalanced dataset due to insufficient coverage of all target classes Skewed dataset through data augmentation Missing data | Data representativeness testing – see [5.1.4](#testing-for-data-representativeness) |

| Training data focused on a subset of all use cases Full range of values not covered in the dataset |  |
| :---- | :---- |
| Poor labelling guidelines Ambiguous data Poor annotation leading to inaccurate or inconsistent labels | Label correctness testing – see [5.1.6](#label-correctness-testing)6 |
| Poor design or integration leading to data pipeline failures Data quality defects compromising data pipeline outputs Performance degradation in the operational use of the data pipeline Security breaches or uncontrolled changes impacting the data pipeline | Data pipeline testing – see 5.1.3 |

2. ## Testing for Bias

Bias in an MLS refers to non-random, unfair differences in treatment based on sensitive attributes like gender, age, or race, which is often unlawful and renders the system discriminatory.

Testing for bias in an MLS involves understanding its potential sources, which primarily include:

* Defects in the training data, such as unrepresentativeness, historical skews, or deliberate poisoning (data bias).

  * Defects within the algorithm, model, or development framework that introduce systemic unfairness, such as an algorithm using a decision threshold for credit scores in a loan approval system (algorithmic bias).

Test approaches for detecting bias include the following:

* Reviews of the overall ML workflow, and especially the data preparation, to identify their potential for introducing bias.

  * Reviews of dataset documentation to identify and mitigate potential sources of unfairness by examining how the data was collected, annotated, and what populations are represented.

    * Static analysis of both data preparation programs and the model implementation code to identify anti-patterns or the mishandling of sensitive attributes.

      * EDA of training data by using visualization and clustering methods to reveal imbalanced data, skewed distributions, or anomalous groupings across different sensitive attributes.

      * Dynamic testing to help detect bias in an ML model by feeding a known unbiased and representative dataset through the system and analyzing its predictions for statistically significant differences in outcomes across various sensitive groups. This identifies bias in model outputs, regardless of whether the bias was introduced during data training or during model development.

      * Label correctness testing (see 5.1.6) to identify mislabeling that causes incorrect associations to be learned between attributes and outcomes for specific sensitive attributes.

      * Disparate impact analysis:

        1. Identify sensitive attributes for the model.

        2. Generate counterfactuals for the sensitive attributes. (e.g., example scenarios where gender is changed from male to female in a loan application).

        3. Generate model output by presenting it with the counterfactuals.

        4. Analyze the results of multiple tests to achieve a statistically significant result, which determines if changing a sensitive attribute causes the model results to change, signaling the presence of bias.

  Note: Disparate impact analysis can also be applied to combinations of sensitive attributes, allowing hidden bias associated with attribute combinations to be identified. However, take care to confirm that counterfactual examples are not unrealistic, as the model may then respond to them rather than to any underlying bias.

    3. ## Data Pipeline Testing

Effective data pipeline testing is essential not only for confirming the reliability and performance of data-driven systems but also for maintaining high data quality throughout the entire ML workflow (see 3.1.2).

A layered approach is employed, beginning with data-pipeline design reviews during the design phase.

Component testing includes testing of data ingestion components, transformation scripts, and sensor interfaces. This testing uses code reviews, static analysis, and hardware-specific tests to verify reliable data capture. Component tests validate data transformation logic, test the implementation of data validation rules, confirm robust error handling, and test for vulnerabilities that could be exploited to introduce malware or poisoned data.

Component integration testing verifies the seamless flow of data across internal interfaces and the correct interpretation of data as it moves through the pipeline. It detects defects arising from mismatched interfaces or incorrect assumptions between components.

System testing assesses the fully assembled pipeline, beginning with smoke testing to confirm basic pipeline functionality. Functional testing verifies the pipeline's compliance with specified requirements, including data transformations and data routing. Non-functional testing evaluates performance under load, scalability to handle increasing data volumes, and security measures to protect data integrity. Fault injection testing measures pipeline robustness by simulating defective data inputs, assessing the system’s ability to maintain data integrity when faced with unexpected or corrupted data. Back-to-back testing (see 6.1.10) compares the operational pipeline against the training pipeline to verify consistent functionality.

System integration testing verifies correct interaction between the data pipeline and external systems or services, including data sources, storage platforms, monitoring tools, and downstream consumers such as ML models.

Testing in production is performed on the operational system. Back-to-back testing verifies that performance is consistent or improved compared to previous versions. A/B testing (see 6.1.9) enables comparisons of new pipeline iterations against baselines, validating improvements while confirming no degradation in the live data stream. Tools can be integrated to continuously monitor and observe model behavior, performance, and potential defects in real time.

Configuration management reviews help verify that the correct pipeline code versions, configurations, and datasets are used across training, testing, and production.

Finally, the test strategies must align with the pipeline's purpose. Training pipelines, often exploratory prototypes, have different priorities than robust operational pipelines. The testing of training pipelines may focus on data integrity, while operational pipeline testing prioritizes reliability, performance, and maintainability.

4. ## Testing for Data Representativeness

Data representativeness testing determines how closely the characteristics of the datasets used for training, validation, and testing ML models match the real-world data that the ML model will encounter in operation. This testing addresses various forms of misrepresentation, including skewed datasets, missing data, disproportionate feature distributions, inadequate coverage of operational scenarios, and imbalanced class representation (see [5.1.1](#input-data-risks-and-mitigations)).

This testing typically includes the following steps:

1. Define the target population:

   * Understand the intended use cases and operational context of the MLS

   * Analyze the characteristics of end users and operational environments

   * Identify the expected operational data distributions and critical edge cases by:

     * consulting domain experts to understand real-world data patterns

     * analyzing data from existing systems or similar applications

     * using benchmark datasets from trusted sources (e.g., NIST, industry databases)

   * Apply stratified sampling to the representative reference data to create a baseline that covers all relevant subgroups in the target domain

2. Analyze data characteristics:

   * Apply EDA (see [3.2.1](#activities-in-data-preparation)) to:

     * training/test datasets being evaluated for representativeness

     * reference dataset that represents the expected operational data

     * visualize distributions through histograms, scatter plots, and other graphical techniques

   * Examine feature relationships, and correlations in particular, to identify patterns that should be preserved

   * Identify potential anomalies, gaps, or unusual concentrations in the data

3. Apply statistical assessment techniques:

   * Use formal statistical tests such as Chi-squared and Kolmogorov-Smirnov to compare distributions \[STATS\]

   * Check for data imbalances, particularly in classification problems

   * Verify adequate coverage of both typical scenarios and edge/boundary cases

Testing for data representativeness should be performed before model training to prevent building models on unrepresentative data. After deployment, the properties of operational input data should be continuously monitored to detect changes that might indicate data drift from the original training data distributions (see [6.1.7](#drift-testing) on drift testing).

5. ## Dataset Constraint Testing

Dataset constraint testing verifies whether the data in a dataset adheres to predefined rules or constraints. The goal is to confirm the integrity and consistency of the data used in ML. For instance, a test of the consistency of values in a dataset could be carried out.

Constraints on data are typically found in database schemas. A database schema defines the structure, types, and relationships of the data. Similarly, for ML datasets, a set of constraints can be defined that act as a logical model of the data in the dataset, which should be satisfied if the data are correct. There are several ways of categorizing dataset constraints. A constraint can be applied to a single value for an attribute, which is found in a single instance (a single-value constraint), for example:

* Missing – tests for missing values and missing attributes.

  * Range – tests that a value is in a given range.

    * Type – tests that an attribute value matches the specified type (e.g., that if an attribute is specified as an integer, the provided value is not a string or real number).

Alternatively, a constraint can apply across multiple values, typically considering the values for a single attribute across several instances (a multi-value constraint), for example:

* Sum – tests that the sum of all values equals, exceeds, or does not exceed a specified value (e.g., the total value of all points awarded for a Formula 1 race cannot exceed 102, and must exceed 50.5 points).

  * Count – tests that the count of all non-null values for attributes or instances equals, exceeds, or does not exceed a specified value.

    * Duplicate – tests for identical or near identical attribute values or instances in a dataset and enforces a limit on how many are allowed (often zero).

      * Useful – tests that an attribute contains some repeated values, as if every entry is unique (like an ID or timestamp), typically provides no useful patterns to be learned for an ML model.

      * Outlier – identifies any values that could be considered as statistical outliers.

A special form of multi-value constraint can compare different values (a comparison constraint), for example:

* Greater Than – tests that one value for an attribute is greater than a value for a second attribute (e.g., the count of lines of code for a program exceeds its count of lines of code with defects).

  * Correlate – tests that the values for one attribute correlate with the values for a second attribute (e.g., all students with a marks attribute value at least 1.33 standard deviations above the mean also have a value of ‘A’ for their grade attribute).

Testing data against the defined constraints can be performed manually. Still, the scale of the activity and the typically large size of the dataset would require this to be automated as part of the data pipeline.

When implemented as part of the pipeline, the tool that implements dataset constraint testing can provide reports to data scientists (for training data anomalies) or to operations staff (for operational data problems).

6. ## Label Correctness Testing

Data label correctness is essential in supervised learning. Inaccurate or inconsistent labels directly undermine the performance and generalization of ML models.

Common approaches to data label correctness testing include:

* Expert Review: Domain experts or trained annotators manually review a sample of labelled data. They evaluate label accuracy using their domain knowledge and guidelines.

  * Multiple Annotation: Data points are independently labelled by multiple annotators and compared using a form of back-to-back testing (see 6.1.10). Disagreements highlight defects that need investigation and resolution. The inter-annotator agreement (IAA) can be measured using metrics such as Cohen's Kappa or simple percentage agreement \[STATS\]. Low IAA scores can indicate defects in labelling guidelines, ambiguous data, or poor annotation.

    * Risk-Based Prioritization for Review and Annotation: Both expert reviews and multiple annotations can be focused using a risk-based approach to identify samples for review and multiple annotations. Prioritization can be based on the likelihood of mislabeling, such as with ambiguous data points (e.g., it is unclear to which category they belong or are near a boundary between classes), and the data that is most likely to impact the application's success or safety.

      * Data Distribution Analysis: When comparable datasets exist, comparing the label distribution of the dataset under test to similar datasets can reveal anomalies and potentially incorrect labels.

      * Automated Rule-Based Tests: Automated tests can be implemented based on predefined label rules or constraints for certain tasks. For instance, verifying that bounding boxes (rectangles used to locate objects in images) do not overlap or extend beyond image boundaries.

      * Model Loss Analysis: Data points exhibiting high loss during model training – meaning the model’s predictions for these points deviate substantially from their true labels – can indicate mislabeling. High loss reflects significant error, indicating the model struggles to learn the assigned label and pointing to a potential defect.

      * Model Confidence Score Analysis: Data points with low prediction confidence from a trained model may be mislabeled, ambiguous, or lie outside the model's training data distribution.

Using a combination of approaches is often most effective. For example, expert reviews are valuable in establishing clear labelling guidelines early on. IAA scores from multiple annotations can then refine the

labelling process. Subsequently, model-based approaches can further identify potential label defects as the model continues to develop.

7. ## Hands-on Exercise: Input Data Testing

For a given dataset (e.g., structured, tabular data), perform input data testing for things like missing data, duplicate data, and outliers.

### **Keywords**

A/B testing, adversarial testing, back-to-back testing, concept drift, data drift, drift testing, metamorphic testing, ML functional performance, ML model testing, review

### **AI-Specific** **Keywords**

Overfitting, underfitting

### **Learning** **Objectives** **for** **Chapter** **6:**

1. ### **Model** **Testing** **for** **Machine** **Learning** **Systems**

AI-6.1.1 (K2)	Give examples of test approaches used for risk mitigation of ML models AI-6.1.2 (K2)	Explain the purpose and focus of reviewing ML model documentation

> > > AI-6.1.3 (K2)	Explain how ML functional performance testing is carried out for probabilistic machine learning systems

AI-6.1.4 (K2)	Summarize adversarial testing of machine learning systems

AI-6.1.5 (K3)	Use metamorphic testing to derive test cases for a given scenario HO-6.1.6 (H2) Apply metamorphic testing  
AI-6.1.7 (K2)	Explain how drift testing is used on operational machine learning systems AI-6.1.8 (K2)	Explain how overfitting and underfitting are detected by testing

AI-6.1.9 (K2)	Explain how A/B testing is used in the context of machine learning systems

AI-6.1.10 (K2)  Explain how back-to-back testing is used in the context of machine learning systems

ML model testing involves addressing specific risks. These include functional risks such as bias, overfitting, and adversarial vulnerabilities, as well as non-functional risks such as lack of AI robustness and performance efficiency, and deployment risks.

1. ## Machine Learning Model Risks and Mitigations

The following table lists examples of ML model risks and corresponding testing that could be used for risk mitigation:

| Potential Risk | Possible Risk Mitigation |
| :---- | :---- |
| Biased or unfair ML model | Testing for bias – see 5.1.2 |
| Unethical model | Ethical system testing |
| Adversarial examples | Adversarial testing – see [6.1.4](#adversarial-testing-of-machine-learning-systems) |
| Overfitted model | Testing for overfitting – see [6.1.8](#testing-for-overfitting-and-underfitting) |
| Underfitted model | Testing for underfitting – see [6.1.8](#testing-for-overfitting-and-underfitting) |
| Unacceptable data drift Unacceptable concept drift | Drift testing – see [6.1.7](#drift-testing) |
| Model causes side-effects | Side-effects testing |
| Model exhibits reward hacking | Reward hacking testing |
| Model API defect | API testing – see 7.1.2 |
| Failure to achieve required ML model performance measures (e.g., lack of accuracy, recall) | ML functional performance testing – see [6.1.3](#ml-functional-performance-testing-of-probabilistic-machine-learning-systems) |
| Functional incorrectness Non-functional defects | Metamorphic testing – see [6.1.5](#metamorphic-testing) |
| Test oracle problem | Metamorphic testing – see [6.1.5](#metamorphic-testing) Back-to-back testing – see 6.1.10 A/B testing – see [6.1.9](#a/b-testing) |
| Poor system requirements | Requirements review Red teaming – see 4.2.2 |

|  | Exploratory testing |
| :---- | :---- |
| Lack of model AI robustness due to unexpected inputs | Adversarial testing – see [6.1.4](#adversarial-testing-of-machine-learning-systems) Fuzz testing |
| Inadequate ML model performance efficiency | Performance testing |
| Poor model documentation (e.g., function, accuracy, interface) | Model documentation review – see [6.1.2](#machine-learning-model-documentation-and-review) |
| Model updates introduce defects | Back-to-back testing – see 6.1.10 |
| Model updates decrease ML model functional performance | A/B testing – see [6.1.9](#a/b-testing) |
| Deployment of updated model causes immediate failure | Smoke testing |
| Deployment of updated model causes regression | Regression testing |
| Security vulnerabilities Safety vulnerabilities Privacy violations Harmful or undesirable outputs (e.g., racist views, dangerous guidance) | Red teaming – see 4.2.2 |

2. ## Machine Learning Model Documentation and Review

Comprehensive documentation for ML models is not just a formality; it is a critical resource. Unlike systems where source code can be inspected directly, MLS present unique challenges due to the limited understandability of machine-generated code, the inherent black-box nature of models, and their dependency on data. Models are also frequently updated, so documentation becomes the main tool for developers, testers, and regulators to understand, evaluate, and trust AI-based systems. Transparency plays a central role in enabling this understanding, allowing stakeholders to trace model behavior, decision logic, and data lineage throughout the AI lifecycle.

Standardized documentation improves communication, supports informed decision-making, and verifies the quality and maintainability of ML models. It is increasingly important for regulatory compliance, as evidenced by frameworks such as the EU AI Act, which emphasizes transparency obligations that require clear documentation of model decisions, limitations, and interpretability measures. For high-risk systems, passing a documentation audit is often a prerequisite for deployment, while for all systems, a thorough review helps verify quality.

Several documentation frameworks exist, including Model Cards, which provide concise overviews of a model’s intended uses, evaluation results, and ethical considerations \[MODEL\_DOC\], and Datasheets for Datasets, which offer standardized formats for describing datasets, including their motivation, composition, collection process, and uses \[DATA\_DOC\].

The following list outlines the typical contents expected for comprehensive ML model documentation, structured so that it can be used as a practical checklist by both developers and testers to help achieve completeness, clarity, and testability:

* General: Identifiers, description, developer, version, date, contact, license, hardware needs

  * Design: Assumptions, technical decisions, ML algorithm

    * Usage: Intended purpose, primary/secondary uses, users, self-learning approach, bias, ethics, safety, transparency, thresholds, platform, data drift, concept drift

      * Datasets: Features, source, collection, availability, preprocessing, use, content, labels, size, privacy, security, bias/fairness, restrictions

      * Testing: Test dataset details, independence of testing, test results, test activities (e.g., functional, adversarial)

      * Functional: Measures, validation dataset, thresholds, actual performance.

      * Non-Functional: Scalability, reliability, availability, performance efficiency (e.g., latency, resource utilization), maintainability, AI robustness.

      * Operational: Deployment plan, deployment environment, computational resources, monitoring metrics/alerts, retraining strategy, model update/rollback plan, deprecation plan, security (adversarial risks), explainability methods

Reviewing documentation against such checklists is a core test activity, aiming to:

* Identify missing information, inaccuracies, and inconsistencies.

  * Improve clarity and readability.

    * Enhance maintainability by identifying where documentation needs improvement.

      * Provide sufficient information for test and deployment activities.

      * Verify that all relevant regulatory requirements have been met.

    3. ## ML Functional Performance Testing of Probabilistic Machine Learning Systems

ML functional performance testing evaluates how well an ML model performs its intended functions by measuring metrics such as accuracy, recall, precision, and F1-score (see 3.3) and comparing the results against defined acceptance criteria.

This testing for probabilistic MLS moves beyond a single passed/failed status to statistically measure a model's performance against its acceptance criteria \[STATS\]. This approach is necessary to address the non-determinism inherent in MLS by evaluating behavior across a large, representative dataset (see 4.1.2).

A precondition for this testing is having acceptance criteria defined in statistical terms. Instead of a simple target, a requirement might specify a performance metric, a margin of error (MoE), and a confidence level (CL). Such a requirement can be used to determine the minimum number of tests required. As the number of tests increases, there are two options:

* Fix the CL and the MoE will decrease. This means the test result becomes more precise.

  * Fix the MoE and the CL will increase. This means the test result becomes more certain.

For example, a criterion might be “98% accuracy with a MoE of ±4% at a 95% CL”. To confirm that the measured accuracy has a maximum MoE of ±4% at the 95% CL, a sample size of 601 test cases is required. This is calculated using the sample size formula for estimating a population proportion. This sample size is based on the conservative assumption that the true accuracy could be anywhere between 0% and 100%, which produces the largest possible uncertainty but still guarantees the ±4% MoE under all conditions. To meet the target accuracy of 98%, at least 589 of the 601 test cases must pass. If, after running all 601 test cases, the observed accuracy is 98%, then the measured MoE at the 95% CL will be narrower than ±4% (approximately ±1.1%), because variance is lower at high accuracy levels. The MoE is computed using the margin of error formula for a sample proportion. This means that when testing, it is not always necessary to run all 601 test cases. Sequential testing provides a formal statistical framework for this early stopping. Instead of always running the full fixed sample, these approaches analyze results as they accumulate and stop early when sufficient evidence supports the accuracy target (or rejects it). If the observed accuracy remains consistently high (e.g., no less than 98%), then the statistical uncertainty decreases as more tests are run. In that situation, the required MoE of ±4% at the 95% CL is reached after about 170 test cases, allowing testing to conclude earlier.

NOTE: The formulae and numerical calculations in this example (for sample size, margin of error, and confidence intervals) are provided for illustration and understanding only; candidates will not be required to derive or compute these values using statistical formulae in the exam.

For safety-critical systems, a stricter reliability requirement might be used, such as “99% reliability with 95% confidence,” which would require 299 test cases, all of which must pass to meet the criteria.

To validate these criteria, testing requires a large test dataset that is completely independent of the training and validation datasets. This test dataset must be a representative sample of the operational input domain (see 5.1.4) to verify that the evaluation reflects real-world conditions. The test cases are then executed using the ML model within an ML development framework capable of statistical analysis.

Finally, the aggregated results are interpreted and reported with statistical confidence, not as a simple passed/failed ratio. A final test report would state, for example, “The model achieved an accuracy of 94%  
±4% at the 95% CL.” This allows stakeholders to understand the range of expected operational performance and make an informed decision on whether the model’s ML functional performance is acceptable for deployment.

4. ## Adversarial Testing of Machine Learning Systems

Adversarial testing involves deliberately providing the model with perturbations to the input data that are often imperceptible to humans. These inputs are designed to cause the model to make incorrect predictions, and, if successful, are called adversarial examples. Thus, the test inputs for adversarial testing, and thus potential adversarial examples, often consist of slightly modified versions of legitimate inputs that cause the model to misclassify them.

Identification of vulnerabilities through adversarial testing allows developers to incorporate safeguards and make the model more robust against adversarial examples. These may be accidental adversarial examples it encounters, or they may be adversarial attacks that involve the malicious use of adversarial examples. Generating effective test inputs for adversarial testing is technically complex, and staying up-to-date with evolving attack techniques is an ongoing challenge.

Adversarial testing can be performed using black-box testing, focusing on the model's input and output behavior without requiring knowledge of its internal workings. This can be achieved by creating an equivalent model for which the internals are known, from which adversarial test inputs can be created

through knowledge of its internal workings. Then, based on the assumption that equivalent models share classification boundaries (i.e. transferability), the adversarial tests can be applied to the original model. In contrast, a brute force approach using a vast number of tests can be used in the hope that some random tests will coincide with an adversarial example.

Adversarial testing can also be performed using white-box testing. Understanding an ML model's internals (architecture, parameters, training process) typically makes it easier to craft adversarial examples.

Adversarial testing can be done manually by crafting specific adversarial examples or through automated algorithms that generate large numbers of variations to find effective adversarial inputs.

5. ## Metamorphic Testing

Metamorphic testing (MT) is a test technique in which new (follow-up) test cases are derived from a previously passed source test case. One or more follow-up test cases are generated by changing (metamorphizing) the source test case using a metamorphic relation (MR). The MR is based on a property of a required function of the test object, and it describes how a change in a test case’s inputs is reflected in the same test case’s expected results.

MT can be used for most test objects and can be applied to both functional and non-functional testing. Testers verify test objectives such as consistency (outputs align across related inputs), monotonicity (outputs change directionally with input), and invariance (outputs remain stable under perturbations). It is particularly useful where the generation of expected results is problematic because an affordable test oracle is unavailable. This is the case with some MLS that use big data, or with systems where testers are unclear about how the ML model derives its predictions, which is often the case. In the area of AI and ML, metamorphic testing has been used for testing image recognition, search engines, route optimization, and voice recognition.

MT is typically selected over traditional oracle-based testing when:

* no reliable expected outputs exist due to model opacity or data scale;

  * the system is a black box; or

    * relational properties (not absolute values) suffice for confidence.

MT is often based on a source test case that passed, and it can also be useful when it is not possible to generate an expected result. For instance, where the program implements a function that is too complex for a human tester to replicate and to use as a test oracle, such as with some complex MLS. In this situation, MT can be used to generate test cases which, when run, will create a set of outputs where the relationships between the outputs (rather than their actual values) are checked for validity. With this form of MT, if the relationships between test outputs hold true, it provides improved confidence in the program. For example, a risk-assessment MLS that predicts an age at death, where increasing the number of cigarettes smoked should decrease the prediction (monotonicity).

Testers derive MRs from domain knowledge, requirements, or domain properties (e.g., laws of physics). MRs can be validated by expert review, running them on reference models and checking coverage of edge cases.

Incorrect MRs (e.g., overlooking complex interactions between variables) or incomplete sets of MRs can lead to false confidence. MT detects relational flaws but not all absolute errors, so it should be used in combination with other test techniques.

6. ## Hands-on Exercise: Apply Metamorphic Testing

In this exercise, students will gain practical experience of the following:

* Deriving several MRs for a given MLS. These MRs should include some in which the expected results of the source and follow-up test cases are the same, and some in which they are different.

  * Generating source test cases for the MLS. These do not have to be guaranteed to pass, but students should be reminded of the limitations of MT when source test cases that passed are unavailable.

    * Using the derived MRs and generated source test cases to derive follow-up test cases.

      * Running the follow-up test cases.

    7. ## Drift Testing

Drift testing can be used to identify two forms of drift in operational MLS:

* Data drift \- occurs when the statistical properties of the operational input data change over time. For instance, input data is now significantly different from the data the model is trained on, due to factors like shifts in user behavior or seasonality. For example, a spam filter encounters new types of phishing attacks that did not exist during its training.

  * Concept drift \- occurs when the relationship between the input data and the correct output changes over time. This means the model’s originally learned patterns or rules no longer reflect the current reality. For instance, due to new financial regulations, a transaction type previously considered 'low-risk' might now be classified as 'high-risk'. The meaning of the data has changed, causing the model's learned decision boundaries to become outdated, leading to a decline in its predictive accuracy.

Dynamic drift testing relies on the availability of feedback from the users, which provides the current ground truth. This current ground truth is compared with the model’s output, and the difference between the two is determined and compared against a threshold value. User feedback can be direct or indirect. For a film recommendation system, an example of direct feedback is when the user rates a recommendation. An example of indirect feedback for the same system would be extracted from the data on the films the user has watched.

Static drift testing is not dependent on the current ground truth but instead compares the statistical properties of the input and predicted output data distributions using a test such as Kolmogorov-Smirnov \[STATS\]. A significant difference in either of these distributions is an indicator that drift has occurred.

8. ## Testing for Overfitting and Underfitting

Overfitting and underfitting are two of the three possible outcomes encountered in ML models, with the third being a “right-fitting” model. Testing for overfitting and underfitting should occur during training, evaluation, and tuning.

Overfitting occurs when a model learns the training data too well, to the extent that it captures noise in the data rather than the underlying pattern. This results in poor generalization of new, unseen data.

To test for overfitting, the model’s ML functional performance is evaluated on a separate test dataset that was not used during training. This test dataset should include some less common examples unlikely to

have been used during training. The model might be overfitting if it performs significantly worse on the test dataset than on the validation dataset.

Underfitting occurs when a model is too simple to capture the underlying structure of the data or when the training data does not contain features that reflect an important relationship between inputs and outputs, resulting in poor ML functional performance on both the training and validation datasets.

During testing, underfitting can be detected by evaluating the model’s ML functional performance metrics such as accuracy, precision, recall, or F1 score. If these metrics are consistently low on both the training and validation sets, it suggests that the model is underfitting.

Visual inspection of the model’s learning curves can also help detect underfitting. If the training and validation errors remain high and relatively close together, without significant improvement as training progresses, it indicates underfitting.

In summary, detecting overfitting and underfitting during testing involves evaluating the model’s ML functional performance on validation data, analyzing ML functional performance metrics, and examining learning curves.

9. ## A/B Testing

A/B testing is an approach where the response of two variants of the program (A and B) to the same inputs are compared with the purpose of determining which of the two variants is better. It is a statistical testing approach that typically requires comparing test results from multiple test runs to determine differences between the programs.

A simple example of this approach is where two promotional offers are emailed to a marketing list divided into two sets. Half of the list gets offer A, and half gets offer B; the success of each offer helps decide which to use in the future. Many e-commerce and web-based companies use A/B testing in production, diverting different consumers to different functionality, to help identify consumers’ preferences.

A/B testing is one approach to addressing the test oracle problem, typically using the existing system as a partial test oracle. A/B testing does not generate test cases and provides no guidance on how the tests should be designed, although operational inputs are often incorporated into the tests.

A/B testing can be used to test updates to an AI-based system, provided there are agreed-upon acceptance criteria, such as ML functional performance metrics, as described in 3.3. Whenever the system is updated, A/B testing is used to determine that the updated variant performs as well as, or better than, the previous variant.

Such a test approach can be used for a simple classifier but can also be used for testing far more complex systems. For example, an update to improve the effectiveness of a smart city transport routing system can be tested using A/B testing. For instance, by comparing average commute times for two variants of the system on consecutive weeks.

A/B testing can also be used to test self-learning systems. When the system makes a change, automated tests are run, and the resulting system characteristics are compared with those before the change. If the system is improved, the change is accepted; otherwise, the system reverts to its previous state.

The most popular statistical techniques for A/B testing are the t-test, z-test, chi-squared test, and Mann-Whitney U test \[STATS\].

10. ## Back-to-Back Testing

Back-to-back testing offers a practical solution to the test oracle problem.

Back-to-back testing involves using an alternative version of the system as a reference point (a pseudo-oracle) and comparing its outputs with those of the system being tested when presented with the same inputs. This pseudo-oracle could be an existing system, or one developed specifically for testing, but this comes at a cost.

Ideally, the pseudo-oracle and the system under test should not share common software components. Otherwise, both systems might contain the same defect, causing their outputs to match even when both are wrong. This can be particularly problematic given the widespread use of reusable, open-source AI components in MLS development. For this reason, the pseudo-oracle is often developed by a different and ideally independent team, perhaps using different ML development frameworks, algorithms, or model settings. Sometimes, conventional software can serve as a pseudo-oracle if it solves the same problem.

When performing functional back-to-back testing, the pseudo-oracle only needs to match functional behavior. It does not need to meet the same non-functional requirements as the system being tested, potentially making it less expensive to build.

This test approach requires only generating test inputs, not expected results, since the pseudo-oracle provides the comparison point. These inputs can come from existing test cases, such as regression test suites, or can be automatically generated from training data, allowing for a large number of tests to be run if automated test execution is supported.

Back-to-back testing provides significant value when migrating an MLS to a new environment, such as moving from development to production, and when comparing test results across environments.

Additionally, this test approach can reveal subtle defects in model behavior that might not be apparent through other test approaches, especially when comparing responses across a wide range of edge cases or unusual inputs.

One significant difference between A/B testing (see 6.1.9) and back-to-back testing is the use of A/B testing to compare two variants of the same MLS using ML functional performance metrics and statistical techniques, versus the use of back-to-back testing to detect defects.

### **Keywords**

ML development testing, ML functional performance, shadow testing

### **AI-Specific** **Keywords**

None

### **Learning** **Objectives** **for** **Chapter** **7:**

1. ### **Machine** **Learning** **Development** **Testing**

AI-7.1.1 (K2)	Give examples of test approaches used for risk mitigation of ML development AI-7.1.2 (K2)	Explain the various forms of ML system deployment testing

This chapter focuses specifically on addressing risks introduced by ML development tools, configuration choices, and deployment mechanisms, rather than the ML model itself. It covers test approaches and test types, such as API testing, ML functional performance testing, A/B testing, back-to-back testing, and reviews, to verify AI robustness and efficiency.

1. ## Machine Learning Development Risks and Mitigations

The following table lists examples of ML development risks and corresponding testing that could be used for risk mitigation:

| Potential Risk | Possible Risk Mitigation |
| :---- | :---- |
| Incorrect or unintended use of library or framework APIs (e.g., TensorFlow, PyTorch) | API testing – see 7.1.2 |
| Sub-optimal framework selection | Framework suitability review |
| Problems within the algorithm, model, or development framework that introduce systemic unfairness | Testing for bias – see [5.1.2](#testing-for-bias) |
| Defective framework installation or build | Smoke testing |
| Defective implementation of the evaluation by the framework | Reviews of framework evaluation code Cross-check framework evaluation results (e.g., against manual benchmarks) |
| Poor performance efficiency (e.g., framework is slow to respond) | Performance testing |
| Poor usability of the framework | Usability testing |
| Defect in a library used by the framework (e.g., defect in PyTorch) Defective algorithm implementation | ML functional performance testing – see 6.1.3 Back-to-back testing – see [6.1.10](#back-to-back-testing) |
| Security vulnerabilities in the framework | Security testing |

| Poor user documentation for the framework | Framework documentation review |
| :---- | :---- |
| Sub-optimal algorithm selection | Algorithm suitability review A/B testing – see [6.1.9](#a/b-testing) |
| Sub-optimal hyperparameter selection (e.g., network structure, learning rate) | ML functional performance testing – see 6.1.3 A/B testing – see [6.1.9](#a/b-testing) |
| Defective allocation of data to training, validation, and testing datasets | Data allocation review |
| Poor selection of evaluation approach (e.g., k-fold cross-validation) | ML functional performance testing – see [6.1.3](#ml-functional-performance-testing-of-probabilistic-machine-learning-systems) |
| Incorrect interpretation of test results due to the stochastic nature of the learning process | ML functional performance testing – see [6.1.3](#ml-functional-performance-testing-of-probabilistic-machine-learning-systems) |
| Deployment defect (e.g., from generating a modified version for a target platform) | Smoke testing ML functional performance testing – see [6.1.3](#ml-functional-performance-testing-of-probabilistic-machine-learning-systems) A/B testing – see [6.1.9](#a/b-testing) |
| Deployed model is incompatible with the operational environment | Smoke testing MLS deployment testing – see 7.1.2 |
| Deployed model is no improvement over the current model | Shadow testing – see 7.1.2 |

2. ## Machine Learning System Deployment Testing

Deploying MLS involves several key test activities focused on verifying the AI-based system functions correctly and reliably in its target environment (e.g., cloud, edge device, mobile). Each of the following test types addresses specific risks during deployment:

* Installability testing \- verifies that the MLS can be successfully installed, configured, and subsequently uninstalled across all supported environments. This includes testing system dependencies (e.g., GPU drivers), compatibility with frameworks, and successfully executing installation scripts.

  * Rollback testing \- verifies the system’s capability to successfully revert to a previously stable and operational state following a degraded or failed deployment. This may only cover the model or cover the complete system (e.g., including the data pipeline). Note that rollback testing must be performed before deployment to confirm rollback readiness.

    * Canary testing – validates new deployments by releasing an updated model to a small subset of production traffic (e.g., 5% of users). Real-time metrics, such as latency, accuracy, and error rates, are monitored to detect regressions before a full rollout.

      * Shadow testing \- runs a new model in parallel with the current production model in real-time, routing the same requests to both systems without affecting live responses. It allows comparing new and old models using live data in a controlled, low-risk environment and can uncover defects, such as performance regressions and data drift, before full deployment.

      * Model conversion testing \- verifies that an ML model retains acceptable predictive accuracy, consistent behavior, and operational efficiency (e.g., inference speed, memory usage) after being converted from its original training format to a deployment format suitable for the target production environment.

      * Cross-device testing \- verifies that the MLS performs correctly across its intended range of deployment targets, from mobile devices and edge devices to cloud servers.

      * API testing \- verifies that the MLS exposes well-defined, standards-compliant interfaces. It validates correct handling of inputs and outputs, error messages, and integration workflows with external systems, such as data feeds, clients, and the pipeline.

| Abbreviation | Description |
| :---- | :---- |
| AI | artificial intelligence |
| AIaaS | AI as a service |
| API | application programming interface |
| CL | confidence level |
| CNN | convolutional neural network |
| CPU | central processing unit |
| DL | deep learning |
| DNN | deep neural network |
| EDA | exploratory data analysis |
| FN | false negative |
| FP | false positive |
| GAN | generative adversarial network |
| GenAI | generative AI |
| GPU | graphics processing unit |
| HO | hands-on objective |
| IAA | inter-annotator agreement |
| kMNC | k-multisection neuron coverage |
| LIME | Local interpretable model-agnostic explanations |
| LLM | large language model(s) |
| LO | learning objective |
| ML | machine learning |
| MLS | machine learning system(s) |
| MoE | margin of error |
| NBC | neuron boundary coverage |

| NLP | natural language processing |
| :---- | :---- |
| RAG | retrieval-augmented generation |
| RNN | recurrent neural network |
| RT | red teaming |
| SVM | support vector machine |
| TN | true negative |
| TP | true positive |

| Term Name | Definition |
| :---- | :---- |
|  accuracy | The ML functional performance metric used to evaluate a classifier, which measures the proportion of predictions that were correct. (After ISO/IEC TR 29119-11) |
| activation function | The formula associated with a neuron in a neural network that determines the output of the neuron from the inputs to the neuron. |
| activation value | The output of an activation function of a neuron in a neural network. |
| adaptive AI-based system | An AI-based system that adjusts its behavior in response to changes in its operational environment. |
| adversarial attack | The deliberate use of adversarial examples to cause an ML model to fail. |
| AI as a Service | A software licensing and delivery model in which AI and AI development services are centrally hosted. |
| AI component | A component that provides AI functionality. |
| AI model | A computer program that implements AI |
| AI-based system | A system that incorporates one or more AI components. |
| algorithmic bias | A type of bias caused by the ML algorithm. |
| annotation | The activity of identifying objects in images with bounding boxes to provide labelled data for classification. |
|  artificial intelligence | The capability of an engineered system to acquire, process, create and apply knowledge and skills. (ISO/IEC TR 29119-11) |
| association | An unsupervised ML learning technique that identifies relationships and dependencies between samples. |
| augmentation | The activity of creating new data points based on an existing dataset. |
| Bayesian model | A statistical model that uses probability to represent the uncertainty of both model inputs and outputs. |

|  bias | The systematic difference in treatment of certain objects, people or groups in comparison to others. (After ISO/IEC TR 24027\) |
| :---- | :---- |
|  big data | Extensive datasets whose characteristics in terms of volume, variety, velocity and/or variability require specialized technologies and techniques to process. |
|  bootstrap technique | A resampling technique that repeatedly draws samples with replacement from a training dataset to estimate the ML functional performance criteria of an ML model. |
| chatbot | An application used to conduct a conversation via text or text-to-speech. |
|  classification | An ML function that predicts the output class for a given input. (After ISO/IEC TR 29119-11) |
|  classifier | An ML model used for classification. Synonym: classification model |
| clustering | An ML function that groups similar data points together. |
| clustering algorithm | A type of ML algorithm used to group similar objects into clusters. |
|  concept drift | A change in the perceived functional performance of an ML model over time caused by changes in user expectations, behavior and the operational environment. |
| confusion matrix | A technique for summarizing the ML functional performance of a classification algorithm. |
|  convolutional neural network | A type of deep learning model designed to process grid-like data such as images, enabling it to recognize spatial patterns and features through layered operations. |
|  cross-prompt injection attack | An attack in which malicious instructions in one prompt or context segment disrupt an AI model’s behavior in a different prompt, turn, or context segment. |
| data acquisition | The activity of acquiring data relevant to the business problem to be solved by an ML model. |
|  data bias | A systematic error caused by inaccurate, incomplete, or unrepresentative training data that leads to unfair outcomes in ML models. |

|  data drift | A change in the distribution of input data over time, which can negatively impact the functional performance of an operational ML model. |
| :---- | :---- |
|  data pipeline | The implementation of data preparation activities to provide input data to support training by an ML algorithm or prediction by an ML model. |
| data point | A set of one or more measurements comprising a single observation used as part of a dataset. |
| data preparation | The activities of data acquisition, data preprocessing and feature engineering in the ML workflow. |
| data preprocessing | The activities of data cleaning, data transformation, data augmentation, and data sampling in the ML workflow. |
| dataset | A collection of data used for training, evaluation, testing and prediction in ML. |
| decision tree | A tree-like ML model whose nodes represent decisions, and whose branches represent possible outcomes. |
| deep learning | ML using deep neural networks to automatically learn complex features and representations from large datasets. |
|  deep neural network | A neural network comprised of several layers of neurons. Synonym: multi-layer perceptron |
|  deepfake | Synthetic media, such as video, audio, or images, created or edited using AI to convincingly mimic or impersonate real people or events. |
| defect prediction | A technique to predict the areas within the test object in which defects will occur or the quantity of defects that are present |
| deterministic | Producing the same set of outputs and final state from a given set of inputs and starting state. |
|  disparate impact analysis | A technique for detecting bias by comparing decisions on original scenarios with their counterfactual versions, where sensitive attributes are swapped. |
|  edge AI | The deployment of AI models on local edge devices, enabling real-time processing near the source of data without relying on cloud-based systems. |
| edge computing | The part of a distributed architecture in which information processing is performed close to where that information is used. |

| epoch | An iteration of ML training on the whole training dataset. |
| :---- | :---- |
|  expert system | An AI-based system for solving problems in a particular domain or application area by drawing inferences from a knowledge base developed from human expertise. |
| explainable AI | The field of study related to understanding the factors that influence AI system outputs. |
|  exploratory data analysis | An interactive, visual, and hypothesis-driven process to summarize, explore, and understand the main characteristics and patterns of data. |
| F1-Score | An ML functional performance metric used to evaluate a classifier which provides a balance between recall and precision. |
| false negative | An ML model prediction in which the model mistakenly predicts the negative class. |
| false positive | An ML model prediction in which the model mistakenly predicts the positive class. |
| feature | An individual measurable attribute of the input data used for training by an ML algorithm and for prediction by an ML model. |
|  feature engineering | The activity in which those attributes in the raw data that best represent the underlying relationships that should appear in the ML model are identified for use in the training data. (ISO/IEC TR 29119-11) |
| feature testing | A test type to determine if an AI model training dataset contains an appropriate set of features. |
|  foundation model | A large-scale ML model trained on large datasets using self-supervised learning, designed as a versatile base that can be fine-tuned or adapted to a wide range of tasks across different domains. |
| frontier AI | A general-purpose AI-based system that exceeds the capabilities of today’s most advanced AI systems. |
| fuzzy logic | A type of logic based on the concept of partial truth represented by certainty factors between 0 and 1\. |
| general AI | A type of AI that can match human cognitive abilities across most intellectual tasks. |
| generative AI | A type of AI that creates new content by learning patterns from existing data. |

|  graphics processing unit | An application-specific integrated circuit designed to manipulate and alter memory to accelerate the creation of images in a frame buffer intended for output to a display device. |
| :---- | :---- |
| ground truth | The information provided by direct observation and measurement that is known to be real or true. |
| hyperparameter | A parameter used to either control the training of an ML model or to set the configuration of an ML model. |
| hyperparameter tuning | The activity of determining the optimal hyperparameters based on particular goals. |
| intelligent agent | An autonomous program which directs its activity towards achieving goals using observations and actions. |
|  inter-annotator agreement | The degree of consensus or similarity among the annotations made by different annotators on the same data. (ISO/IEC TS 12791\) |
| large language model | A text-to-text generative AI system trained on very large collections of language data. |
|  linear regression | A statistical technique that models the relationship between variables by fitting a linear equation to the observed data when the target variable is numeric. |
| locked AI-based system | A deterministic AI-based system with a fixed unchanging model which does not change its behavior once it is deployed. |
| ML algorithm | An algorithm used to create an ML model from a training dataset. |
| ML development framework | A software platform that provides tools and libraries to build, train, and deploy ML models. |
| ML function | Functionality implemented by an ML model, such as classification, ML regression or clustering. |
|  ML regression | A type of ML function that results in a numerical or continuous output value for a given input. (After ISO/IEC TR 29119-11) |
| MLS | A system that integrates one or more ML models. |
| ML workflow | The set of activities used to develop, deploy and operate an ML model. |
| model confidence score analysis | A technique that identifies data points with low confidence scores from training, which are indicators for mislabeled data points. |

| model loss analysis | A technique that identifies data points with high loss values during training, which are indicators for mislabeled data points. |
| :---- | :---- |
| multimodal model | An ML model designed to handle multiple types of data modalities, such as text, images, audio, and video. |
| multiple annotation | An approach in which labelled data points from multiple annotators are compared. |
|  narrow AI | AI focused on a single well-defined task to address a specific problem. Synonym: weak AI (ISO/IEC TR 29119-11) |
| natural language processing | A field of computing that provides the ability to read, understand, and derive meaning from natural languages. |
|  neural network | A network of primitive processing elements connected by weighted links with adjustable weights, in which each element produces a value by applying a nonlinear function to its input values, and transmits it to other elements or presents it as an output value. Synonym: artificial neural network (ISO/IEC 2382\) |
| neuromorphic processor | An integrated circuit designed to mimic the biological neurons of the human brain. |
| neuron | A node in a neural network, usually receiving multiple input values and generating an activation value. |
| noise | A distortion or corruption in data. |
| non-determinism | A property of a system or process in which an outcome is not uniquely determined by its initial conditions. |
| outlier | An observation that lies outside the overall pattern of the data distribution. |
|  overfitting | The generation of an ML model that corresponds too closely to the training dataset, resulting in a model that finds it difficult to generalize to new data. (After ISO/IEC TR 29119-11) |
| perceptron | A neural network with just one layer and one neuron |

|  precision | An ML functional performance metric used to evaluate a classifier, which measures the proportion of predicted positives that were correct. (After ISO/IEC TR 29119-11) |
| :---- | :---- |
|  pretrained model | An ML model that has already been trained on a large, general-purpose dataset and can be reused or fine-tuned for specific tasks. |
| probabilistic | Behavior described in terms of probabilities, where outcomes are uncertain and described by likelihoods rather than certainty. |
|  random forest | Ensemble ML technology for classification, ML regression and other tasks that operate by constructing and running many decision trees and then either outputting the mode of the class or the mean prediction of the individual trees. |
|  recall | An ML functional performance metric used to evaluate a classifier, which measures the proportion of actual positives that were predicted correctly. Synonym: sensitivity (After ISO/IEC TR 29119-11) |
|  recurrent neural network | A type of deep learning model designed to process sequential data, enabling it to recognize patterns and dependencies over time. |
|  reinforcement learning | An approach in which an ML model, known as an agent, learns by using a trial-and-reward feedback loop with its environment to achieve specific objectives. |
|  retrieval-augmented generation | An ML technique where a GenAI system dynamically improves its output by retrieving relevant external information to supplement its internal knowledge. |
| reward function | A function that defines the success of reinforcement learning. |
|  reward hacking | The activity performed by an intelligent agent to maximize its reward function to the detriment of meeting the original objective. (After ISO/IEC TR 29119-11) |
|  search algorithm | An algorithm that systematically visits a subset of all possible states or structures until the goal state or structure is reached. (After ISO/IEC TR 29119-11) |
| self-learning system | An adaptive system that changes its behavior based on learning through trial and error. |

|  | (After ISO/IEC TR 29119-11) |
| :---- | :---- |
| sensitive attributes | Characteristics that define legally or ethically protected groups and individuals that must be controlled to prevent discrimination. |
| sentiment analysis | The use of natural language processing and machine learning to identify and classify the emotional tone expressed in text. |
| stratified sampling | A technique to confirm if a sample proportionally represents different sub-populations within the overall population. |
| super AI | A type of AI that far exceeds human capabilities. |
| supervised learning | An approach to training an ML model by using a labeled dataset. |
| support vector machine | A supervised ML algorithm that finds the optimal hyperplane between data points for classification or ML regression tasks. |
|  technological singularity | A point in the future when technological advances are no longer controllable by people. (After ISO/IEC TR 29119-11) |
|  temperature | A setting controlling the randomness of GenAI outputs, with lower values generating more predictable results and higher values generating more creative results. |
| test oracle problem | The challenge of determining whether a test has passed or failed for a given set of test inputs and state. |
| training dataset | A dataset used to train an ML model. |
|  transformer | A neural network architecture that processes sequential data to capture long-range dependencies, powering NLP tasks, computer vision and multimodal applications. |
| true negative | A prediction in which the model correctly predicts the negative class. |
| true positive | A prediction in which the model correctly predicts the positive class. |
|  underfitting | The generation of an ML model that does not reflect the underlying trend of the training dataset, resulting in a model that makes inaccurate predictions. (after ISO/IEC TR 29119-11) |
| unsupervised learning | An approach to training an ML model by using an unlabeled dataset. |

| validation dataset | A dataset used to evaluate a trained ML model with the purpose of tuning the model. |
| :---- | :---- |
|  von Neumann architecture | A computer architecture which consists of five main components: memory, a central processing unit, a control unit, input, and output. |
|  weight | An internal variable of a connection between neurons in a neural network that affects how it computes its outputs and that changes as the neural network is trained. |

* **ISO/IEC/IEEE** **12207**	(2017), Systems and software engineering — Software life cycle processes

* **ISO/IEC** **2382**	(2015), Information technology — Vocabulary

* **ISO/IEC** **22989**	(2022), Information technology — Artificial intelligence — Artificial intelligence concepts and terminology

* **ISO/IEC** **TR** **24027**	(2021) Information technology — Artificial intelligence (AI) — Bias in AI systems and AI aided decision making

* **ISO/IEC** **25010**	(2023), Systems and software engineering – Systems and software Quality Requirements and Evaluation (SQuaRE) \- Product quality model

* **ISO/IEC** **25059**	(2023), Software engineering – Systems and software Quality Requirements and Evaluation (SQuaRE) – Quality model for AI systems

* **ISO** **26262-6**	(2018), Road vehicles — Functional safety — Part 6: Product development at the software level

* **ISO/IEC** **TR** **29119-11** (2020), Software and systems engineering — Software testing — Part 11: Guidelines on the testing of AI-based systems

* **ISO/IEC** **TS** **42119-2**	(2025) Artificial intelligence — Testing of AI – Part 2: Overview of testing AI systems

* **ISO/IEC** **42119** **series** (in development) Artificial intelligence — Testing of AI

  > > \[CTFL\]	ISTQB® Certified Tester Foundation Level v4.0.1, [https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) (accessed 29.07.2025)

  > > \[CT-GenAI\]	ISTQB® Certified Tester – Testing with Generative AI (CT-GenAI), [https://istqb.org/certifications/gen-ai/](https://istqb.org/certifications/gen-ai/) (accessed 19.12.2025)

Reference for terminology used in this syllabus:

* ISTQB® Glossary	[https://glossary.istqb.org/](https://glossary.istqb.org/)

\[COV\_REF\]	An Overview of Structural Coverage Metrics for Testing Neural Networks, Usman et al, Aug 2022, arXiv:2208.03407 (accessed 29.07.2025)

\[DATA\_DOC\]	Gebru, T., Morgenstern, J., Vecchione, B., et al. (2021). Datasheets for Datasets.  
Communications of the ACM, 64(12), 86-92, [https://dl.acm.org/doi/pdf/10.1145/3502158](https://dl.acm.org/doi/pdf/10.1145/3502158) (accessed 07.10.2025)

\[EU AI Act\]	EU Artificial Intelligence Act, July 2024, [https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L\_202401689](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ%3AL_202401689) (accessed 30.07.2025)

\[MODEL\_DOC\] Mitchell, M., Wu, S., Varma, R., et al. (2019). Model Cards for Model Reporting. Proceedings of the Conference on Fairness, Accountability, and Transparency, [https://dl.acm.org/doi/10.1145/3287560.3287596](https://dl.acm.org/doi/10.1145/3287560.3287596) (accessed 07.10.2025)

\[OECD AI\]	OECD Recommendation of the Council on Artificial Intelligence, May 2024, Organisation for Economic Co-operation and Development (OECD), [https://legalinstruments.oecd.org/en/instruments/oecd-legal-0449](https://legalinstruments.oecd.org/en/instruments/oecd-legal-0449) (accessed 07.10.2025)

\[UN Gov AI\]	Governing AI for Humanity: Final Report, September 2024, United Nations, [https://www.un.org/sites/un2.un.org/files/governing\_ai\_for\_humanity\_final\_report\_en.pdf](https://www.un.org/sites/un2.un.org/files/governing_ai_for_humanity_final_report_en.pdf) (accessed 29.07.2025)

\[STATS\]	An Introduction to Statistical Learning: With Applications in R (2nd ed.) by Gareth James, Daniela Witten, Trevor Hastie, and Robert Tibshirani, Springer.

ISTQB® is a registered trademark of International Software Testing Qualifications Board

The specific learning objectives applying to this syllabus are shown at the beginning of each chapter. Each topic in the syllabus will be examined according to the learning objective for it.

The learning objectives begin with an action verb corresponding to its cognitive level of knowledge as listed below.

# *Level* *1:* *Remember* *(K1)*

The candidate will remember, recognize and recall a term or concept.

| Examples |
| :---- |
| Recall the concepts of the test pyramid. |
| Recognize the typical objectives of testing. |

**Action** **verbs:** Recall, recognize.

# *Level* *2:* *Understand* *(K2)*

The candidate can select the reasons or explanations for statements related to the topic, and can summarize, compare, classify and give examples for the testing concept.

**Action** **verbs**: Classify, compare, differentiate, distinguish, explain, give examples, interpret, summarize

| Examples | Notes |
| :---- | :---- |
| Classify test tools according to their purpose and the test activities they support. |  |
| Compare the different test levels. | Can be used to look for similarities, differences or both. |
| Differentiate testing from debugging. | Looks for differences between concepts. |
| Distinguish between project and product risks. | Allows two (or more) concepts to be separately classified. |
| Explain the impact of context on the test process. |  |
| Give examples of why testing is necessary. |  |
| Infer the root cause of defects from a given profile of failures. |  |
| Summarize the activities of the work product review process. |  |

# *Level* *3:* *Apply* *(K3)*

The candidate can carry out a procedure when confronted with a familiar task, or select the correct procedure and apply it to a given context.

**Action** **verbs**: Apply, implement, prepare, use

| Examples | Notes |
| :---- | :---- |
| Apply boundary value analysis to derive test cases from given requirements. | Should refer to a procedure / technique / process etc. |
| Implement metrics collection methods to support technical and management requirements. |  |
| Prepare installability tests for mobile apps. |  |
| Use traceability to monitor test progress for completeness and consistency with the test objectives, test strategy, and test plan. | It could be used in an LO that wants the candidate to be able to use a technique or procedure. Similar to 'apply'. |

# *Level* *4:* *Analyze* *(K4)*

The candidate can separate information related to a procedure or technique into its constituent parts for better understanding, and can distinguish between facts and inferences. Typical application is to analyze a document, software or project situation and propose appropriate actions to solve a problem or task.

**Action** **verbs:** Analyze, deconstruct, outline, prioritize, select.

| Examples | Notes |
| :---- | :---- |
| Analyze a given project situation to determine which black-box or experience-based test techniques should be applied to achieve specific goals. | Examinable only in combination with a measurable goal of the analysis. Should be of form 'Analyze xxxx to xxxx' (or similar). |
| Prioritize test cases in a given test suite for execution based on the related product risks. |  |
| Select the appropriate test levels and test types to verify a given set of requirements. | Needed where the selection requires analysis. |

### **Reference**

(For the cognitive levels of learning objectives)

Anderson, L. W. and Krathwohl, D. R. (eds) (2001) A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives, Allyn & Bacon

This section lists the traceability between the Business Outcomes and the Learning Objectives of the Certified Tester AI Testing.

The first part of the table shows the number of Learning Objectives per Business Outcome, while the second part shows which Learning Objectives are associated with each Business Outcome.

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | :---- | ----- | ----- | ----- | ----- | ----- | ----- | :---- | :---- |
|  BO1 | Understand the current state of AI, including generative AI. |  |  8 |  |  |  |  |  |  |  |
|  BO2 | Experience the implementation and testing of machine learning models. |  |  |  10 |  |  |  |  |  |  |
|  BO3 | Understand the working and testing of simple neural networks. |  |  |  |  2 |  |  |  |  |  |
|  BO4 | Understand the specific AI quality characteristics defined by ISO/IEC 25059\. |  |  |  |  |  3 |  |  |  |  |
|  BO5 | Calculate and interpret ML functional performance metrics for machine learning models. |  |  |  |  |  |  1 |  |  |  |
|  BO6 | Recognize the scope and importance of the two test levels that are specific to the testing of machine learning systems. |  |  |  |  |  |  |  3 |  |  |

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | ----- | ----- | :---- | :---- | :---- | :---- | :---- | ----- | ----- |
|  BO7 | Contribute to the development of an effective test strategy for a machine learning system. |  |  |  |  |  |  |  |  5 |  |
|  BO8 | Design and execute test cases for machine learning systems. |  |  |  |  |  |  |  |  |  14 |
| Unique LO |  Learning Objective | K- Level |  |  |  |  |  |  |  |  |
| 1 | Introduction to Artificial Intelligence |  |  |  |  |  |  |  |  |  |
| 1.1 | Introduction to AI |  |  |  |  |  |  |  |  |  |
|  AI-1.1.1 | Differentiate between AI-based systems and conventional systems |  K2 |  X |  |  |  |  |  |  |  |
|  AI-1.1.2 | Distinguish between narrow AI, general AI, and super AI |  K2 |  X |  |  |  |  |  |  |  |
| AI-1.1.3 | Explain the different types of AI technologies | K2 | X |  |  |  |  |  |  |  |
| AI-1.1.4 | Explain generative AI | K2 | X |  |  |  |  |  |  |  |
|  AI-1.1.5 | Compare the choices available for hardware to implement machine learning systems |  K2 |  X |  |  |  |  |  |  |  |

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | ----- | ----- | :---- | :---- | ----- | :---- | :---- | :---- | :---- |
|  AI-1.1.6 | Compare the options for the development and hosting of AI models |  K2 |  X |  |  |  |  |  |  |  |
|  AI-1.1.7 | Summarize the functionality provided by ML development frameworks |  K2 |  X |  |  |  |  |  |  |  |
|  AI-1.1.8 | Explain how regulations and standards affect the development and testing of AI-based systems |  K2 |  X |  |  |  |  |  |  |  |
| 2 | Quality Characteristics for AI-Based Systems |  |  |  |  |  |  |  |  |  |
| 2.1 | Quality Characteristics for AI-Based Systems |  |  |  |  |  |  |  |  |  |
|  AI-2.1.1 | Classify behaviors of AI-based systems according to the quality characteristics defined in ISO/IEC 25059 |  K2 |  |  |  |  X |  |  |  |  |
|  AI-2.1.2 | Explain the special considerations that arise when AI is used in safety-related systems |  K2 |  |  |  |  X |  |  |  |  |
| 2.2 | Acceptance Criteria for AI-Based Systems |  |  |  |  |  |  |  |  |  |
| AI-2.2.1 | Give examples of acceptance criteria for AI-based systems | K2 |  |  |  | X |  |  |  |  |
| 3 | Machine Learning |  |  |  |  |  |  |  |  |  |

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | ----- | :---- | ----- | :---- | :---- | ----- | :---- | :---- | :---- |
| 3.1 | Introduction to Machine Learning |  |  |  |  |  |  |  |  |  |
| AI-3.1.1 | Distinguish between the different forms of ML | K2 |  | X |  |  |  |  |  |  |
|  AI-3.1.2 | Summarize the workflow used to create an ML system |  K2 |  |  X |  |  |  |  |  |  |
|  AI-3.1.4 | Summarize the use of pretrained models, fine-tuning and retrieval-augmented generation |  K2 |  |  X |  |  |  |  |  |  |
| 3.2 | Data for Machine Learning |  |  |  |  |  |  |  |  |  |
|  AI-3.2.1 | Explain the activities related to data preparation |  K2 |  |  X |  |  |  |  |  |  |
|  AI-3.2.3 | Contrast the use of training, validation, and test datasets in the development of an ML model |  K2 |  |  X |  |  |  |  |  |  |
|  3.3 | ML Functional Performance Metrics for Classification |  |  |  |  |  |  |  |  |  |
|  AI-3.3.1 | Calculate common ML functional performance metrics from a given set of confusion matrix data |  K3 |  |  |  |  |  X |  |  |  |
| 3.4 | Neural Networks |  |  |  |  |  |  |  |  |  |

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | ----- | :---- | ----- | ----- | :---- | :---- | :---- | :---- | :---- |
|  AI-3.4.1 | Explain the structure and working of a deep neural network |  K2 |  |  |  X |  |  |  |  |  |
|  AI-3.4.3 | Describe the different coverage measures for neural networks |  K2 |  |  |  X |  |  |  |  |  |
| 4 | Testing AI-Based Systems |  |  |  |  |  |  |  |  |  |
| 4.1 | Introduction to Testing AI-Based Systems |  |  |  |  |  |  |  |  |  |
|  AI-4.1.1 | Compare the testability of locked and adaptive AI-based systems |  K2 |  |  X |  |  |  |  |  |  |
|  AI-4.1.2 | Explain why a statistical approach is often needed when testing AI-based systems |  K2 |  |  X |  |  |  |  |  |  |
|  AI-4.1.3 | Explain the challenges and solutions relating to test oracles for AI-based systems |  K2 |  |  X |  |  |  |  |  |  |
| 4.2 | Testing Generative AI and LLM |  |  |  |  |  |  |  |  |  |
| AI-4.2.1 | Explain how generative AI can be tested | K2 |  | X |  |  |  |  |  |  |
| AI-4.2.2 | Implement red teaming for GenAI systems | K3 |  | X |  |  |  |  |  |  |

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | ----- | :---- | :---- | :---- | :---- | :---- | ----- | ----- | ----- |
| 4.3 | Test Levels and Machine Learning Systems |  |  |  |  |  |  |  |  |  |
|  AI-4.3.1 | Summarize the test levels used to develop machine learning systems |  K2 |  |  |  |  |  |  |  X |  |
|  AI-4.3.2 | Explain how risk-based testing is applied to machine learning systems |  K2 |  |  |  |  |  |  |  X |  |
|  5 | Input Data Testing for Machine Learning Systems |  |  |  |  |  |  |  |  |  |
|  5.1 | Input Data Testing for Machine Learning Systems |  |  |  |  |  |  |  |  |  |
|  AI-5.1.1 | Give examples of test approaches used for the risk mitigation of input data for a machine learning system |  K2 |  |  |  |  |  |  X |  X |  |
| AI-5.1.2 | Explain how to test for bias | K2 |  |  |  |  |  |  |  | X |
|  AI-5.1.3 | Summarize the various forms of data pipeline testing |  K2 |  |  |  |  |  |  |  |  X |
| AI-5.1.4 | Explain how to test for data representativeness | K2 |  |  |  |  |  |  |  | X |
| AI-5.1.5 | Apply dataset constraint testing | K3 |  |  |  |  |  |  |  | X |

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | ----- | :---- | :---- | :---- | :---- | :---- | ----- | ----- | ----- |
| AI-5.1.6 | Explain label correctness testing | K2 |  |  |  |  |  |  |  | X |
| 6 | Model Testing for Machine Learning Systems |  |  |  |  |  |  |  |  |  |
| 6.1 | Model Testing for Machine Learning Systems |  |  |  |  |  |  |  |  |  |
|  AI-6.1.1 | Give examples of test approaches used for risk mitigation of ML models |  K2 |  |  |  |  |  |  X |  X |  |
|  AI-6.1.2 | Explain the purpose and focus of reviewing ML model documentation |  K2 |  |  |  |  |  |  |  |  X |
|  AI-6.1.3 | Explain how ML functional performance testing is carried out for probabilistic machine learning systems |  K2 |  |  |  |  |  |  |  |  X |
|  AI-6.1.4 | Summarize adversarial testing of machine learning systems |  K2 |  |  |  |  |  |  |  |  X |
|  AI-6.1.5 | Use metamorphic testing to derive test cases for a given scenario |  K3 |  |  |  |  |  |  |  |  X |
|  AI-6.1.7 | Explain how drift testing is used on operational machine learning systems |  K2 |  |  |  |  |  |  |  |  X |
|  AI-6.1.8 | Explain how overfitting and underfitting are detected by testing |  K2 |  |  |  |  |  |  |  |  X |

| Business Outcomes: AI Testing |  |  | BO1 | BO2 | BO3 | BO4 | BO5 | BO6 | BO7 | BO8 |
| :---- | :---- | ----- | :---- | :---- | :---- | :---- | :---- | ----- | ----- | ----- |
|  AI-6.1.9 | Explain how A/B testing is used in the context of machine learning systems |  K2 |  |  |  |  |  |  |  |  X |
|  AI-6.1.10 | Explain how back-to-back testing is used in the context of machine learning systems |  K2 |  |  |  |  |  |  |  |  X |
| 7 | Machine Learning Development Testing |  |  |  |  |  |  |  |  |  |
| 7.1 | Machine Learning Development Testing |  |  |  |  |  |  |  |  |  |
|  AI-7.1.1 | Give examples of test approaches used for risk mitigation of ML development |  K2 |  |  |  |  |  |  X |  X |  |
|  AI-7.1.2 | Explain the various forms of ML system deployment testing |  K2 |  |  |  |  |  |  |  |  X |

The ISTQB CT-AI v2.0 is a major update and rewrite of v1.0. Due to rapidly evolving AI technology, a major update was necessary. The focus of v2.0 is clearly on testing of AI-based systems. Due to the release of the ISTQB CT Testing with Generative AI the chapter on testing with AI was completely removed.

This major release has made the following changes:

* Shortened introduction to AI in general

* Inclusion of Generative AI and testing of Generative AI

* Consolidation of AI quality characteristics and their challenges

* Reduced focus on ML performance metrics

* Refined test levels: Input data testing and ML model testing

* Refined test types

* Removed testing with AI

* Exclusion of test environments for testing AI-based systems

* Minimum required training time reduced from 4-days to 3-days

All testing terms are defined in the ISTQB® Glossary ([https://glossary.istqb.org/](https://glossary.istqb.org/) ).

A/B testing, 62

accuracy, 35

adaptive AI-based system, 41 adversarial testing, 59

AI as a Service, 18

AI functional correctness, 23 AI robustness, 23

AI-based system, 15, 40

AI-based systems, 15

API testing, 67

artificial intelligence, 15

association, 28

attack, 43, 61

back-to-back testing, 63

canary testing, 67

classification, 28, 34

clustering, 28

concept drift, 61

confusion matrix, 35

data drift, 61

data pipeline testing, 50 data preparation, 32

data representativeness testing, 51 dataset constraint testing, 52 device compatibility testing, 67 disparate impact analysis, 50

drift testing, 61

dynamic testing, 48, 50 EU AI Act, 20  
explainability, 24

exploratory data analysis, 29, 33, 49

exploratory testing, 44

F1-score, 35

fine-tuning, 31

follow-up test case, 60 frontier AI, 15

functional adaptability, 23, 25

functional correctness, 22, 25

general AI, 16

generative AI, 17, 43

input data testing, 45, 48

installability testing, 67

intervenability, 23, 26

k-multisection neuron coverage, 38, 68

label correctness testing, 50, 53

large language model, 32, 42 locked AI-based system, 40 machine learning, 15, 16, 28

metamorphic relation, 60

metamorphic testing, 60, 61

ML algorithm, 29

ML development framework, 19, 29 ML development testing, 65

ML functional performance, 58, 65 ML functional performance criteria, 30 ML functional performance metric, 34  
ML functional performance metrics, 29 ML model, 18, 29, 31, 33

ML model documentation, 57 ML model testing, 56  
ML regression, 28

ML workflow, 29, 30, 34 model conversion testing, 67 model testing, 45

multiple annotation, 53

narrow AI, 15

neural network, 36, 37

neuron boundary coverage, 38, 69

neuron coverage, 38

non-determinism, 24

non-functional test, 30, 60

overfitting, 62

perceptron, 38

precision, 35

pretrained model, 31

recall, 35

red teaming, 43

reinforcement learning, 16, 28 retrieval augmented generation, 32 review, 49, 57  
risk-based testing, 46

robustness, 26

rollback testing, 67

safety, 24, 26

self-learning, 24

shadow testing, 67

societal and ethical risk mitigation, 22, 23, 26 source test case, 60

static analysis, 49

super AI, 16

supervised learning, 16, 28

test dataset, 30, 34

test oracle, 41, 60 testing for bias, 49 training dataset, 33

transparency, 23, 24, 25

underfitting, 62

unsupervised learning, 16, 28

user controllability, 23, 25

validation dataset, 29, 33

[image1]: <data:image/png;base64,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>