UPDATE "user" u
SET    questions = t2.questions_updated
FROM   (select u.uid, coalesce(questions_updated,'{}') as questions_updated from "user" u left join
(select question.uid, array_agg(question.id) as questions_updated from question group by question.uid) as q
on u.uid = q.uid) as t2
WHERE  t2.uid = u.uid;