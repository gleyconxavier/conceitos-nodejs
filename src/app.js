const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const getRepositoryIndex = (repositories, id) => {
  const repositoryIndex = repositories
  .findIndex(repository => repository.id === id);

  return repositoryIndex;
}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = getRepositoryIndex(repositories, id);

  if(repositoryIndex === -1) {
    response.status(400).json();
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndex(repositories, id);

  if(repositoryIndex === -1) {
    response.status(400).json();
  };

  repositories.splice(repositoryIndex, 1);

  response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndex(repositories, id);

  if(repositoryIndex === -1) {
    response.status(400).json();
  };

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
