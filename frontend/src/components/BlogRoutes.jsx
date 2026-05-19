import React from "react";
import { Route, Switch } from "react-router-dom";
import DatabaseBlog from "./DatabaseBlog";
import DatabaseBlogData from "./DatabaseBlogData";
import NotFound from "./NotFound";

function BlogRoutes() {
  return (
    <Switch>
      {DatabaseBlogData.map((post) => (
        <Route
          key={post.URL}
          path={`/blog/${post.URL}`}
          exact
          render={() => <DatabaseBlog url={post.URL} />}
        />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

export default BlogRoutes;
