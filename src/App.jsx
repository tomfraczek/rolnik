import { useState, useEffect } from "react";
import "./App.css";

const query = `
{
  questions(id: "5KceMqWPkA2F7Nmm8kC54S"){
    questionsCollection(limit: 1000){
      items{
        title
        answers
        correctAnswer
        assetsCollection(limit: 1){
          items{
            url
          }
        }
      }
    }
  }
}
`;

function App() {
  const [page, setPage] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(null);
  useEffect(() => {
    console.log(page);
  }, [page]);
  useEffect(() => {
    window
      .fetch(`https://graphql.contentful.com/content/v1/spaces/6ou5r9n0gkfq/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer Ye_oVtACthl_R7P9PD5zeR9uOhikp0g23WusGZO4Jhk`,
        },
        body: JSON.stringify({ query }),
      })
      .then((response) => response.json())
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        }

        // rerender the entire component with new data
        setPage(data.questions.questionsCollection.items);
      });
  }, []);

  if (!page) {
    return "Loading...";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = page.filter((question) =>
      question.title.toLowerCase().includes(search.toLowerCase())
    );
    setResults(results);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="search" onChange={handleChange} />
        <button type="submit">search</button>
      </form>
      {results &&
        results.map((result) => (
          <>
            <h2>{result.title}</h2>
            {result.assetsCollection.items.length > 0 &&
              result.assetsCollection.items.map((asset, i) => (
                <img src={asset.url} alt="asset" key={i} />
              ))}
            {result.answers.map((answer, i) => (
              <p
                style={{
                  textDecoration:
                    answer === result.correctAnswer ? "underline" : "none",
                  fontWeight:
                    answer === result.correctAnswer ? "bold" : "normal",
                }}
                key={i}
              >
                {String.fromCharCode(97 + i)}) {answer}
              </p>
            ))}
          </>
        ))}

      {!results && (
        <>
          <p>Pytań w puli: {page.length}</p>
        </>
      )}
      {/* {!results &&
        page.map((question) => (
          <>
            <h2>{question.title}</h2>
            {question.assetsCollection.items.length > 0 &&
              question.assetsCollection.items.map((asset, i) => (
                <img src={asset.url} alt="asset" key={i} />
              ))}
            {question.answers.map((answer, i) => (
              <p
                style={{
                  textDecoration:
                    answer === question.correctAnswer ? "underline" : "none",
                  fontWeight:
                    answer === question.correctAnswer ? "bold" : "normal",
                }}
                key={i}
              >
                {String.fromCharCode(97 + i)}) {answer}
              </p>
            ))}
          </>
        ))} */}
    </>
  );
}

export default App;
