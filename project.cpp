#include <stdio.h>

#define MAX_PARTITIONS 10
#define MAX_JOBS 10

void allocateFirstFit(int memory[], int partitions, int jobs[], int jobCount) {
    int assignments[jobCount];
    for (int i = 0; i < jobCount; i++) {
        assignments[i] = -1;
        for (int j = 0; j < partitions; j++) {
            if (memory[j] >= jobs[i]) {
                assignments[i] = j;
                memory[j] -= jobs[i];
                break;
            }
        }
    }
    printf("\nFirst Fit Allocation:\n");
    for (int i = 0; i < jobCount; i++) {
        printf("Job %d (%d KB) -> ", i + 1, jobs[i]);
        if (assignments[i] != -1)
            printf("Partition %d\n", assignments[i] + 1);
        else
            printf("Not Assigned\n");
    }
}

void allocateBestFit(int memory[], int partitions, int jobs[], int jobCount) {
    int assignments[jobCount];
    for (int i = 0; i < jobCount; i++) {
        assignments[i] = -1;
        int bestPartition = -1;
        for (int j = 0; j < partitions; j++) {
            if (memory[j] >= jobs[i]) {
                if (bestPartition == -1 || memory[j] < memory[bestPartition])
                    bestPartition = j;
            }
        }
        if (bestPartition != -1) {
            assignments[i] = bestPartition;
            memory[bestPartition] -= jobs[i];
        }
    }
    printf("\nBest Fit Allocation:\n");
    for (int i = 0; i < jobCount; i++) {
        printf("Job %d (%d KB) -> ", i + 1, jobs[i]);
        if (assignments[i] != -1)
            printf("Partition %d\n", assignments[i] + 1);
        else
            printf("Not Assigned\n");
    }
}

void allocateWorstFit(int memory[], int partitions, int jobs[], int jobCount) {
    int assignments[jobCount];
    for (int i = 0; i < jobCount; i++) {
        assignments[i] = -1;
        int worstPartition = -1;
        for (int j = 0; j < partitions; j++) {
            if (memory[j] >= jobs[i]) {
                if (worstPartition == -1 || memory[j] > memory[worstPartition])
                    worstPartition = j;
            }
        }
        if (worstPartition != -1) {
            assignments[i] = worstPartition;
            memory[worstPartition] -= jobs[i];
        }
    }
    printf("\nWorst Fit Allocation:\n");
    for (int i = 0; i < jobCount; i++) {
        printf("Job %d (%d KB) -> ", i + 1, jobs[i]);
        if (assignments[i] != -1)
            printf("Partition %d\n", assignments[i] + 1);
        else
            printf("Not Assigned\n");
    }
}

void allocateNextFit(int memory[], int partitions, int jobs[], int jobCount) {
    int assignments[jobCount];
    int lastAllocated = 0;
    for (int i = 0; i < jobCount; i++) {
        assignments[i] = -1;
        for (int j = lastAllocated; j < partitions; j = (j + 1) % partitions) {
            if (memory[j] >= jobs[i]) {
                assignments[i] = j;
                memory[j] -= jobs[i];
                lastAllocated = (j + 1) % partitions;
                break;
            }
            if (j == lastAllocated - 1)
                break;
        }
    }
    printf("\nNext Fit Allocation:\n");
    for (int i = 0; i < jobCount; i++) {
        printf("Job %d (%d KB) -> ", i + 1, jobs[i]);
        if (assignments[i] != -1)
            printf("Partition %d\n", assignments[i] + 1);
        else
            printf("Not Assigned\n");
    }
}

int main() {
    int memoryUnits[MAX_PARTITIONS] = {100, 500, 200, 300, 600};
    int jobSizes[MAX_JOBS] = {212, 417, 112, 426};
    int partitionCount = 5, jobCount = 4;

    int memoryCopy1[MAX_PARTITIONS], memoryCopy2[MAX_PARTITIONS], memoryCopy3[MAX_PARTITIONS], memoryCopy4[MAX_PARTITIONS];
    for (int i = 0; i < partitionCount; i++) {
        memoryCopy1[i] = memoryUnits[i];
        memoryCopy2[i] = memoryUnits[i];
        memoryCopy3[i] = memoryUnits[i];
        memoryCopy4[i] = memoryUnits[i];
    }
    
    allocateFirstFit(memoryCopy1, partitionCount, jobSizes, jobCount);
    allocateBestFit(memoryCopy2, partitionCount, jobSizes, jobCount);
    allocateWorstFit(memoryCopy3, partitionCount, jobSizes, jobCount);
    allocateNextFit(memoryCopy4, partitionCount, jobSizes, jobCount);
    
    return 0;
}
