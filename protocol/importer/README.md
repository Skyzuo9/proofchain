# `formal-conjectures` Automated Problem Importer

Synchronizes open Lean 4 research conjectures from [`google-deepmind/formal-conjectures`](https://github.com/google-deepmind/formal-conjectures) (covering Erdős Problems, OEIS Conjectures, Ben Green's 100 Open Problems, and the Kourovka Notebook) into ProofChain `blueprint.json` packages.

## Usage

```bash
# 1. Dry-run preview on a single formal-conjectures Lean file
python3 protocol/importer/import_formal_conjectures.py \
  --file protocol/importer/sample_fc_erdos.lean

# 2. Fetch directly from GitHub (`google-deepmind/formal-conjectures`)
python3 protocol/importer/import_formal_conjectures.py \
  --github-path FormalConjectures/ErdosProblems/1.lean \
  --start-id 13 --tier 4 --pool 6000 --write

# 3. Batch-import up to 20 open Erdős conjectures from a local clone
git clone --depth 1 https://github.com/google-deepmind/formal-conjectures.git /tmp/fc
python3 protocol/importer/import_formal_conjectures.py \
  --local-dir /tmp/fc/FormalConjectures/ErdosProblems \
  --only-open --limit 20 --start-id 13 --write
```
