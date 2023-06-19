# DATABASE
1. Reupdate segments's table:
```
    CREATE TABLE asr_segments (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER,
        "label_url" VARCHAR,
        "seed" INTEGER,
        "index" INTEGER,
        "length" INTEGER,
        "text" VARCHAR,
        "audibility" VARCHAR,
        "noise" VARCHAR,
        "region" VARCHAR,
        "hard_level" INTEGER,
        "predict_kaldi" VARCHAR,
        "wer_kaldi" FLOAT,
        "predict_wenet" VARCHAR,
        "wer_wenet" FLOAT,
        "status" VARCHAR
    );
```

# Backend
## FASTAPI 

