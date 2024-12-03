# 🌟 **Codex of Agents: AI-Powered Framework for Narrative Management** 🌟

## 🚀 **Overview**

This project is part of my ongoing journey to explore and understand how **Generative AI** can enhance **tabletop role-playing games (TTRPGs)**. By combining my passion for **narrative-driven games** and **AI technologies**, I am building a system that leverages **pre-trained Large Language Models (LLMs)** from **AWS Bedrock** and **OpenAI** to create dynamic, AI-powered NPCs and in-game agents.

The goal is to use AI to simulate complex character behaviors, personalities, and memory-driven decisions, allowing for richer storytelling experiences in an at-home TTRPG setting. This project serves as a way to deepen my understanding of how generative AI models can interact with human creativity in a narrative context, connecting my hobbies with professional skills.

---

## 🎯 **Project Goals**

- **Education through Experimentation**: The project serves as a learning tool for exploring how Generative AI models can be integrated into narrative-driven environments.
- **Uniform Handling of Entities**: By defining entities like **Document**, **Actor**, **Location**, and **Agent**, we ensure consistent handling of metadata, relationships, and domain events, following principles from **Clean Architecture** and **Domain-Driven Design (DDD)**.
- **Implementing Agentic Systems**: Building a system where **Agents** can generate plans, execute actions using **Tools**, and orchestrate with other agents to achieve complex goals.
- **Separation of Concerns**: Maintains a strict separation between the **UX (frontend)** and **domain services** via a **Backend for Frontend (BFF)** pattern, ensuring scalability and transferability of lessons to other projects.
- **Scalable Architecture**: Developed with modularity in mind, allowing for easy extension of features and AI models as new capabilities are explored.

---

## 🛠️ **Technology Stack**

- **Infrastructure**: Built using **AWS CDK** for scalable cloud deployment.
- **Backend Services**:
  - **TypeScript** used for backend development, following **Domain-Driven Design (DDD)** principles.
  - Stateless backend services powered by **AWS Lambda**, **API Gateway**, and **DynamoDB**.
- **Frontend**: A **React** UI interacting with the backend via a **BFF** pattern.
- **Generative AI Models**:
  - **AWS Bedrock** models like **Claude** and **Titan** for tasks such as semantic analysis, chat interfaces, and context embeddings.

---

## 🏗️ **Project Structure**

The project is structured to reflect **Clean/Hexagonal Architecture**, separating business logic, infrastructure, and interfaces:

```plaintext
root/
│
├── bin/                    # Entry point for the CDK app
├── infra/                  # AWS CDK infrastructure definitions
├── src/                    # Application source code
│   ├── adapters/
│   │   ├── primary/        # Interfaces for primary adapters (e.g., controllers)
│   │   ├── secondary/      # Interfaces for secondary adapters (e.g., database access)
│   │   └── repositories/   # Repository interfaces and implementations
│   ├── application/        # Application-specific logic
│   │   ├── use-cases/      # Use cases or application services
│   │   ├── dtos/           # Data Transfer Objects
│   │   └── schemas/        # Validation schemas for API or UI data
│   ├── domain/             # Core business entities and logic
│   │   ├── entities/       # Entities like Document, Actor, Location, Agent
│   │   ├── events/         # Domain events
│   │   ├── repositories/   # Repository interfaces
│   │   ├── schemas/        # Domain-specific schemas
│   │   └── services/       # Domain services
│   └── shared/             # Shared utilities and helpers
│       ├── config/         # Configuration files and environment variables
│       ├── errors/         # Custom error classes
│       └── utils/          # General utilities and helpers
├── test/                   # Jest tests
└── README.md               # Project documentation
```

---

## 📚 **Core Concepts**

### **Entities and Domain Modeling**

- **Entity Base Class**:

  - Provides unique identification, domain event handling, and common functionalities for all entities.
  - Properties:
    - `_id`: Unique identifier (UUID).
    - `_created`: Timestamp of creation.
    - `_updated`: Timestamp of the last update.
    - `props`: Properties specific to the derived class.

- **Document Class** (Extends Entity):

  - Serves as the base class for all document types in the system.
  - Additional Properties:
    - `title`: The document's title.
    - `content`: Main body of the document.
    - `metadata`: Collection of key-value pairs for additional context.

- **Actor and Location** (Extend Document):
  - **Actor** represents a person or creature within the game world.
    - Additional Properties:
      - `name`: Full name, given name, etc.
      - `ancestry`: The ancestral origins of the actor.
  - **Location** represents a place within the game world.
    - Additional Properties:
      - `geography`: Details about terrain, climate, etc.

### **Agents and Tools**

- **Agents**:

  - Utilize **LLMs** to interpret instructions, understand context, and formulate plans.
  - Properties:
    - `capabilities`: List of actions or tools the agent can utilize.
    - `context`: Context-specific information needed for functioning.
    - `state`: Current status or intermediate data.
  - Methods:
    - `generatePlan(instruction)`: Creates a plan of action.
    - `executePlan(plan)`: Executes the steps defined in the plan.
    - `updateState(newState)`: Updates the agent's internal state.

- **Tools**:
  - Standardized components that enable agents to perform specific actions.
  - Standard Structure:
    - `name`: Unique name for the tool.
    - `description`: Explains the tool's function.
    - `inputSchema`: Defines expected input parameters.
    - `params`: Specific configurations or settings.
  - **Examples**:
    - **DynamoDB Tool**: Allows agents to interact with DynamoDB to retrieve items.
    - **AgentHandoff Tool**: Enables an agent to delegate tasks or pass context to another agent.

### **Agent Orchestration**

- **Orchestration** allows multiple agents to work together, achieving goals too complex for a single agent.
- **LLM-as-a-Judge** Pattern:
  - An agent acts as a "judge" to evaluate and score outputs generated by other agents.
  - Enables systematic and unbiased selection of the best result.

---

## ✅ **Testing**

- **Test Data Generation**: Test data will be dynamically generated via **LLMs** to simulate realistic agent interactions, making it easier to test complex agent states and interactions.
- **Testing Framework**:
  - **Jest** will be used for unit testing core logic and services.
  - **Postman** will be used to perform **integration and API testing** for the domain services layer, ensuring that API endpoints work correctly in an end-to-end environment.

---

## 📚 **Reference: Academic Paper**

The project is inspired by and references concepts from the paper:

**"LARP: Language-Agent Role-Play Framework for Open-World Simulations"**  
_(Read the full paper here: [LARP Framework - arXiv](https://arxiv.org/abs/2312.17653))_

### **Key Concepts from the Paper**:

- **Cognitive Agents**: Simulating agents with dynamic personalities, memory recall, and decision-making capabilities using AI.
- **Memory Models**: Handling both **episodic** and **semantic memory** for agents.
- **Personality-Driven Actions**: Agents make decisions based on their personality, emotional state, and memories.

---

## 🛠️ **Planned Milestones**

- **Phase 1: Domain Structure** – Build out core domain models and entities, focusing on LLM-powered agent memory, personality management, and decision-making. Initially define entities/sub-entities like **Documents**, **Agents**, **Tools**, **Sessions**, and **Interactions**.
- **Phase 2: CRUD Implementation** – Develop CRUD functionality for the above entitiies
- **Phase 3: Domain Services - Documents** – Impliment first phase of domain services and entities to cover the bounded context around Documents, mocking references to the Agentic/AI space as needed.
- **Phase 4: Domain Services - Agents** – Impliment first phase of domain services and entities to cover the bounded context around Agents, mocking references to the documents space as needed.
- **Phase 5: Domain Services - Integrations** – Connect the dots, removing mocks as needed, and proving the basic domain concepts via the integration of the two main bounded contexts.
- **Phase 6: UX & BFF** – Develop the UI and interaction layer, integrating it with backend services.
- **Phase 7: Testing and Refinement** – Integration testing with **Postman** and unit testing with **Jest**.
- **Phase 8: Advanced Features** – Implement agent hand-off, multi-agent interactions, and flow control within sessions.

---

## 📦 **Deployment**

The project is designed to be deployed using **AWS CDK**. An example environment configuration file will be added later to simplify deployment. Placeholder environment variables will be provided in the initial deployment.

---

## 🔮 **Future Directions**

- **Contextual Model Mapping**: Developing a more granular mapping of which tasks are handled by AWS Bedrock vs. OpenAI models as the project matures.
- **Expanded Decision-Making**: Exploring how fine-tuning models or building custom AI models can further improve decision-making for agents.
- **Tool Extensibility**: Implementing and extending tools on a function-by-function basis, allowing for specific behaviors and actions within the agent system.
- **Enhanced Orchestration**: Distributing the functionality of the Swarm Orchestrator into entities like Session and Agent to manage complex agent interactions and hand-offs.
- **Event-Driven Architecture**: Incorporating event sourcing and CQRS patterns to handle complex workflows and improve scalability.

---

## 📝 **License & Contribution**

- **License**: The project will initially be under a **restrictive license**, with broader release under a more permissive license as the project matures.
- **Contributions**: Contributions are currently restricted, but information on contributing and the license will be updated in future iterations.

---

## 💡 **How to Get Started**

1. **Clone the Repository**: `git clone [repository-url]`
2. **Install Dependencies**: `npm install`
3. **Build the Project**: `npm run build`
4. **Deploy with CDK**: `npm run cdk deploy`
5. **Run Tests**: `npm test`

---

## 📬 **Contact**

For more information or to discuss collaboration, feel free to reach out via [contact information].