import React, { useState } from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const [results, setResults] = useState([]);

  const submit = (e) => {
    e.preventDefault();
    Axios.get("/api/search", { params: { q: query, limit } })
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <form onSubmit={submit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions"
        />
        <input
          type="number"
          min="1"
          max="20"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          style={{ width: "60px" }}
        />
        <button type="submit">Search</button>
      </form>
      {results.map((item) => (
        <div key={item.id} style={{ padding: "10px", marginBottom: "2rem" }}>
          <TweetItem2
            id={item.id}
            content={item.content}
            author={item.username}
            time={item.time}
            likes={item.like_number}
            answers={item.answer_number}
            isOwner={false}
            isLoggedIn={false}
            selectedLanguageFrontendCode="original"
          />
        </div>
      ))}
    </div>
  );
};

export default SearchBar;
