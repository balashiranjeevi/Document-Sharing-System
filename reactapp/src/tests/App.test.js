// App.test.js - Jest Test Cases for Full Coverage

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';

import DocumentList from '../components/DocumentList';
import DocumentForm from '../components/DocumentForm';
import DocumentDetail from '../components/DocumentDetail';


jest.mock('axios');
beforeEach(() => jest.clearAllMocks());

describe('React App Functional Tests', () => {
  // API utility methods
  test('day8_getAllDocuments', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const data = await api.getAllDocuments();
    expect(data).toEqual([{ id: 1 }]);
  });

  test('day9_getDocumentById', async () => {
    axios.get.mockResolvedValueOnce({ data: { id: 2, title: 'Doc' } });
    const data = await api.getDocumentById(2);
    expect(data).toEqual({ id: 2, title: 'Doc' });
  });

  test('day10_createDocument', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 3 } });
    const data = await api.createDocument({ title: 'Test' });
    expect(data).toEqual({ id: 3 });
  });

  test('day11_updateDocument', async () => {
    axios.put.mockResolvedValueOnce({ data: { id: 4, title: 'Updated' } });
    const data = await api.updateDocument(4, { title: 'Updated' });
    expect(data.title).toBe('Updated');
  });

  test('day12_deleteDocument', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });
    const data = await api.deleteDocument(5);
    expect(data).toEqual({});
  });

  // Form tests
  test('day13 submit valid form', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 6 } });
    render(<BrowserRouter><DocumentForm /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Doc' } });
    fireEvent.change(screen.getByLabelText(/file name/i), { target: { value: 'new.pdf' } });
    fireEvent.change(screen.getByLabelText(/file type/i), { target: { value: 'application/pdf' } });
    fireEvent.change(screen.getByLabelText(/owner id/i), { target: { value: '1' } });

    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  test('day14 show validation errors', async () => {
    render(<BrowserRouter><DocumentForm /></BrowserRouter>);
    fireEvent.click(screen.getByText(/save/i));
    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
  });

  // List rendering
  test('day15 renders documents', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Doc 1' }] });
    render(<BrowserRouter><DocumentList /></BrowserRouter>);
    expect(await screen.findByText('Doc 1')).toBeInTheDocument();
  });

  test('day16 shows empty state', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<BrowserRouter><DocumentList /></BrowserRouter>);
    expect(await screen.findByText(/no documents/i)).toBeInTheDocument();
  });

  test('day17 shows error on fetch fail', async () => {
    axios.get.mockRejectedValueOnce(new Error('Fetch error'));
    render(<BrowserRouter><DocumentList /></BrowserRouter>);
    expect(await screen.findByText(/failed to fetch/i)).toBeInTheDocument();
  });

  // Detail
  test('day18 renders document', async () => {
    axios.get.mockResolvedValueOnce({ data: { id: 1, title: 'Detail View' } });
    render(
      <MemoryRouter initialEntries={['/documents/1']}>
        <Routes><Route path="/documents/:id" element={<DocumentDetail />} /></Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText('Detail View')).toBeInTheDocument();
  });

  test('day19 handles not found', async () => {
    axios.get.mockRejectedValueOnce(new Error('Not found'));
    render(
      <MemoryRouter initialEntries={['/documents/404']}>
        <Routes><Route path="/documents/:id" element={<DocumentDetail />} /></Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/document not found/i)).toBeInTheDocument();
  });



  // Edge test cases
  test('day20 shows error state on fetch fail', async () => {
    axios.get.mockRejectedValueOnce(new Error('Fetch failed'));
    render(<BrowserRouter><DocumentList /></BrowserRouter>);
    expect(await screen.findByText(/failed to fetch/i)).toBeInTheDocument();
  });

  test('day21 shows empty state when no documents found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<BrowserRouter><DocumentList /></BrowserRouter>);
    expect(await screen.findByText(/no documents found/i)).toBeInTheDocument();
  });
});
