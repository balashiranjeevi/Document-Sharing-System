package com.examly.springapp;

import com.examly.springapp.model.Document;
import com.examly.springapp.service.DocumentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.security.Provider.Service;
import java.util.List;
import org.springframework.data.domain.Page;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.test.context.ActiveProfiles("test")
@org.springframework.test.context.TestPropertySource(locations = "classpath:application-test.properties")
@org.springframework.context.annotation.Import(com.examly.springapp.config.TestSecurityConfig.class)
class DocumentManagementSystemApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DocumentService documentService;

    private Document sampleDoc;

    @BeforeEach
    void setup() {
        sampleDoc = new Document();
        sampleDoc.setId(1L);
        sampleDoc.setTitle("Test Document");
        sampleDoc.setFileName("file.pdf");
        sampleDoc.setFileType("application/pdf");
        sampleDoc.setOwnerId(1L);
        sampleDoc.setIsPublic(true);
    }

    


    @Test
    void day1_testGetAllDocuments() throws Exception {
        Page<Document> mockPage = new org.springframework.data.domain.PageImpl<>(List.of(sampleDoc));
        Mockito.when(documentService.getAllDocuments(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyString(), Mockito.anyString(), Mockito.any()))
                .thenReturn(mockPage);

        mockMvc.perform(get("/api/documents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Document"));
    }

    @Test
    void day2_testGetDocumentById() throws Exception {
        Mockito.when(documentService.getDocumentById(1L)).thenReturn(sampleDoc);

        mockMvc.perform(get("/api/documents/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("file.pdf"));
    }

    @Test
    void day3_testGetDocumentByIdNotFound() throws Exception {
        Mockito.when(documentService.getDocumentById(99L))
                .thenThrow(new EntityNotFoundException("Not Found"));

        mockMvc.perform(get("/api/documents/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Not Found"));
    }

    @Test
    void day4_testCreateDocument() throws Exception {
        Mockito.when(documentService.createDocument(Mockito.any(Document.class))).thenReturn(sampleDoc);

        mockMvc.perform(post("/api/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDoc)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Document"));
    }

    @Test
    void day5_testCreateDocumentInvalidData() throws Exception {
        Document invalid = new Document();

        mockMvc.perform(post("/api/documents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid document data"));
    }

    @Test
    void day6_testUpdateDocument() throws Exception {
        Mockito.when(documentService.updateDocument(Mockito.eq(1L), Mockito.any(Document.class))).thenReturn(sampleDoc);

        mockMvc.perform(put("/api/documents/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDoc)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileType").value("application/pdf"));
    }

    @Test
    void day7_testDeleteDocument() throws Exception {
        mockMvc.perform(delete("/api/documents/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Document deleted successfully"));
    }
}
