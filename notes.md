# Web DB IV Notes

## A good data model

- captures all the data the system needs
- captures only the data the system needs
- reflects reality
- is flexible, can evolve with the system
- guarantees data integrity
- is driven by the way the data will be used

## Components

- entities === resources -> tables
- attributes/properties -> columns
- relationships between entities === sub routes (/projects/:id/actions) -> foreign keys

## Workflow

- identify entities -> squares on paper
- identify attributes -> bulleted list (see Tracks below)
- identify relationships -> lines joining squares on paper (1---\*)

### Tracks

- id
- name
- start date
- end date

## Relationships

- one to one -> one to zero or one
- one to many -> the most common relationship
- many to many (smoke and mirrors, an illusion) -> need a third table (the mantra)

## Tips

**The most important tool when gathering requirements for a model is "ears"**

**Pick two entities at a time**

**mantra: one to many -> there is a FK**

**mantra: the FK goes on -> the many side**

**mantra: for many to many need -> a third table**

**many to many table can have extra information**
