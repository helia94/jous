UPDATE question q
SET    public_answer = t2.public_answer_updated
FROM   (select q.id, coalesce(public_answer_updated,'{}') as public_answer_updated from question q left join 
(select question, array_agg(publicanswer.id) as public_answer_updated from publicanswer group by publicanswer.question) as a 
on q.id = a.question) as t2
WHERE  t2.id = q.id;