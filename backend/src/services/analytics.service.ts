import { PipelineStage } from "mongoose";
import { DocumentRepository } from "../repositories/document.repository";
import { MostEditedResult, TagCooccurrenceResult } from "../types/document";

export class AnalyticsService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async getMostEditedDocuments(): Promise<MostEditedResult[]> {
    const pipeline: PipelineStage[] = [
      {
        $project: {
          slug: 1,
          title: 1,
          version: 1,
          updatedAt: "$metadata.updatedAt",
          editCount: { $size: "$revision_history" }
        }
      },
      { $sort: { editCount: -1, updatedAt: -1 } },
      { $limit: 10 }
    ];

    return this.documentRepository.aggregate<MostEditedResult>(pipeline);
  }

  async getTagCooccurrence(): Promise<TagCooccurrenceResult[]> {
    const pipeline: PipelineStage[] = [
      {
        $project: {
          tags: {
            $sortArray: {
              input: { $setUnion: ["$tags", []] },
              sortBy: 1
            }
          }
        }
      },
      {
        $match: {
          "tags.1": { $exists: true }
        }
      },
      {
        $project: {
          pairs: {
            $reduce: {
              input: { $range: [0, { $size: "$tags" }] },
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $map: {
                      input: {
                        $range: [{ $add: ["$$this", 1] }, { $size: "$tags" }]
                      },
                      as: "pairIndex",
                      in: [
                        { $arrayElemAt: ["$tags", "$$this"] },
                        { $arrayElemAt: ["$tags", "$$pairIndex"] }
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $unwind: "$pairs" },
      {
        $group: {
          _id: "$pairs",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          tags: "$_id",
          count: 1
        }
      },
      { $sort: { count: -1, tags: 1 } }
    ];

    return this.documentRepository.aggregate<TagCooccurrenceResult>(pipeline);
  }
}
